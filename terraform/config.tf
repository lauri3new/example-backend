locals {
  /* configs = {
    _defaults = {
      name = "example"
    }
    production = {}
  }

  config = merge(
    lookup(local.configs, "_defaults"),
    lookup(local.configs, terraform.workspace)
  ) */
  config = {
    name            = "example-api"
    domain          = "example.com"
    environment     = terraform.workspace
    region          = "eu-west-1"
    container_image = "12345678910.dkr.ecr.eu-west-1.amazonaws.com/example-api-production"
    rds = {
      instance_class         = "t3.micro"
      master_credentials_arn = "arn:aws:secretsmanager:eu-west-1:12345678910:secret:secret/rds-master-ABcDEF"
    }
  }
}
