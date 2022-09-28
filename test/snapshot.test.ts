import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { OctopusDeployDocument } from '../src/index';

describe('Snapshot test', () => {
    const stack = new Stack();

    new OctopusDeployDocument(stack, 'Ec2OctopusDeploy', {
        secretArn: 'secretArn',
    });

    const template = Template.fromStack(stack);

    test('Snapshot test', () => {
        expect(template.toJSON()).toMatchSnapshot();
    });
});
