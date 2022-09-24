import { awscdk } from "projen";
const project = new awscdk.AwsCdkConstructLibrary({
  author: "devops-at-home",
  authorAddress: "76842834+devops-at-home@users.noreply.github.com",
  authorName: "DevOps@Home",
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  eslint: false,
  name: "cdk-ec2-octopus-deploy-tentacle",
  projenrcTs: true,
  repositoryUrl: "https://github.com/devops-at-home/cdk-ec2-octopus-deploy-tentacle.git",

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();