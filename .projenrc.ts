import { awscdk } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'devops-at-home',
  authorAddress: 'https://devops-at-ho.me',
  authorName: 'DevOps@Home',
  cdkVersion: '2.43.0',
  defaultReleaseBranch: 'main',
  eslint: false,
  name: 'cdk-ec2-octopus-deploy-tentacle',
  projenrcTs: true,
  repositoryUrl:
    'https://github.com/devops-at-home/cdk-ec2-octopus-deploy-tentacle.git',
  license: 'MIT',
  gitignore: ['.idea', '.DS_Store'],
  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 120,
      tabWidth: 2,
      singleQuote: true,
    },
  },
  githubOptions: {
    pullRequestLint: false,
  },
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ['devops-at-home'],
  },
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.jest!.addTestMatch('**/?(*.)@(spec|test).[tj]s?(x)');

project.synth();
