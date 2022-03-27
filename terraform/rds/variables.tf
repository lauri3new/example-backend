variable "name" {
  description = "name of stack"
  type        = string
}

variable "environment" {
  description = "name of environment"
  type        = string
}

variable "region" {
  description = "aws region"
  type        = string
}

variable "subnet_ids" {
  description = "dbsg subnet ids"
  type        = tuple([string, string])
}

variable "instance_class" {
  description = "instance class of db e.g. micro"
  type        = string
}

variable "username" {
  description = "master username"
  type        = string
}

variable "password" {
  description = "master password"
  type        = string
}

variable "vpc_id" {
  description = "id of vpc"
  type        = string
}

variable "ecs_sg" {
  description = "id of ecs security group"
  type        = string
}
