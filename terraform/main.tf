provider "aws" {
  region = "eu-west-1"
}

terraform {
  backend "s3" {
    bucket         = "terraform-state"
    key            = "api"
    region         = "eu-west-1"
    dynamodb_table = "terraform-state"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.6.0"
    }
  }
}

data "aws_secretsmanager_secret" "db_root" {
  arn = local.config.rds.master_credentials_arn
}

data "aws_secretsmanager_secret_version" "current" {
  secret_id = data.aws_secretsmanager_secret.db_root.id
}

module "vpc" {
  source      = "./vpc"
  name        = local.config.name
  environment = local.config.environment
  region      = local.config.region
}

module "route53" {
  source      = "./route53"
  domain_name = local.config.domain
  name        = local.config.name
  environment = local.config.environment
}

module "acm" {
  source         = "./acm"
  domain_name    = local.config.domain
  hosted_zone_id = module.route53.hosted_zone_id
  environment    = local.config.environment
}

module "alb" {
  source = "./alb"
  name   = local.config.name
  vpc_id = module.vpc.id
  subnet_ids = [
    module.vpc.public_subnet_1.id,
    module.vpc.public_subnet_2.id
  ]
  environment       = local.config.environment
  certificate_arn   = module.acm.certificate_arn
  health_check_path = "/status"
}

module "ecr" {
  source      = "./ecr"
  name        = local.config.name
  environment = local.config.environment
}

module "ecs" {
  source      = "./ecs"
  name        = local.config.name
  environment = local.config.environment
  vpc_id      = module.vpc.id
  region      = local.config.region
  subnet_ids = [
    module.vpc.public_subnet_1.id,
    module.vpc.public_subnet_2.id
  ]

  container_port           = 8080
  container_cpu            = 256
  container_memory         = 512
  container_image          = local.config.container_image
  aws_alb_target_group_arn = module.alb.aws_alb_target_group_arn
  service_desired_count    = 1
  lb_sg                    = module.alb.aws_security_group_id

  /* variable "container_environment" {
    description = "The container environmnent variables"
    type        = list(any)
  }

  variable "container_secrets" {
    description = "The container secret environmnent variables"
    type        = list(any)
  }

  variable "container_secrets_arns" {
    description = "ARN for secrets"
  } */

}

module "rds" {
  source         = "./rds"
  name           = local.config.name
  environment    = local.config.environment
  region         = local.config.region
  instance_class = local.config.rds.instance_class
  subnet_ids = [
    module.vpc.public_subnet_1.id,
    module.vpc.public_subnet_2.id
  ]
  username = jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.current.secret_string))["username"]
  password = jsondecode(nonsensitive(data.aws_secretsmanager_secret_version.current.secret_string))["password"]
  vpc_id   = module.vpc.id
  ecs_sg   = module.ecs.security_group_id
}
