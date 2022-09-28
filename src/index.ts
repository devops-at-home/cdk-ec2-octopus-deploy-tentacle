import { ResourceProps } from 'aws-cdk-lib';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnDocument } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

interface OctopusDeployDocumentProps extends ResourceProps {
    secretArn: string;
}

export class OctopusDeployDocument extends Construct {
    constructor(scope: Construct, id: string, props: OctopusDeployDocumentProps) {
        super(scope, id);

        const {} = props;

        const { roleName } = new Role(this, 'Role', {
            assumedBy: new ServicePrincipal('ssm.amazon.com'),
            inlinePolicies: {},
        });

        new CfnDocument(this, 'CfnDocument', {
            content: getContent(roleName),
            documentType: 'Automation',
            name: 'ConfigureOctopusDeploy',
            targetType: '/AWS::EC2::Instance',
        });
    }
}

const getContent = (assumeRole: string) => {
    // From: https://github.com/linuxacademy/Hands-On-with-AWS-Systems-Manager/blob/master/Automation-Change-Mgmt/ssm-automation.json
    return {
        description:
            "Automation for creating an instance, attaching an SSM role to it, figuring out it's platform type and patching it accordingly",
        schemaVersion: '0.3',
        assumeRole,
        parameters: {
            EC2IamRole: {
                type: 'String',
                description: 'IAM Instance Profile Name, usually is the name of the IAM role',
                default: 'MyEC2SSMRole',
            },
            Application: {
                type: 'String',
                description: 'Choose from one of the choices below to install',
                allowedValues: ['mariadb-server', 'httpd'],
            },
        },
        mainSteps: [
            {
                name: 'wait_for_ssm_info',
                action: 'aws:waitForAwsResourceProperty',
                inputs: {
                    Service: 'ssm',
                    Api: 'DescribeInstanceInformation',
                    Filters: [{ Key: 'InstanceIds', Values: ['{{create_ec2.InstanceIds}}'] }],
                    PropertySelector: '$.InstanceInformationList[0].PingStatus',
                    DesiredValues: ['Online'],
                },
            },
            {
                name: 'DeployApplicationByChoice',
                action: 'aws:branch',
                inputs: {
                    Choices: [
                        {
                            NextStep: 'InstallConfigureMariaDB',
                            Variable: '{{Application}}',
                            StringEquals: 'mariadb-server',
                        },
                        {
                            NextStep: 'InstallConfigureHttpd',
                            Variable: '{{Application}}',
                            StringEquals: 'httpd',
                        },
                    ],
                    Default: 'InstallConfigureHttpd',
                },
            },
            {
                name: 'InstallConfigureMariaDB',
                action: 'aws:runCommand',
                inputs: {
                    DocumentName: 'AWS-RunShellScript',
                    InstanceIds: ['{{create_ec2.InstanceIds}}'],
                    Parameters: {
                        commands: [
                            'yum -y install {{Application}}',
                            'systemctl enable mariadb; systemctl start mariadb',
                            'sleep 5',
                            'aws configure set default.region us-east-1',
                            "mysqladmin password $(aws ssm get-parameter --name mysql-pass --with-decryption --output text --query 'Parameter.Value')",
                        ],
                    },
                },
                isEnd: true,
            },
            {
                name: 'InstallConfigureHttpd',
                action: 'aws:runCommand',
                inputs: {
                    DocumentName: 'AWS-RunShellScript',
                    InstanceIds: ['{{create_ec2.InstanceIds}}'],
                    Parameters: {
                        commands: [
                            'yum -y install {{Application}}',
                            'systemctl enable {{Application}}; systemctl start {{Application}}',
                        ],
                    },
                },
                isEnd: true,
            },
        ],
    };
};
