variable "name" {
  description = "name of stack"
  type        = string
}

variable "environment" {
  description = "name of environment"
  type        = string
}

variable "region" {
  description = "the AWS region in which resources are created"
  type        = string
}

variable "vpc_id" {
  description = "id of the vpc"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs"
}

variable "container_port" {
  description = "Port of container"
}

variable "container_cpu" {
  description = "The number of cpu units used by the task"
}

variable "container_memory" {
  description = "The amount (in MiB) of memory used by the task"
}

variable "container_image" {
  description = "Docker image to be launched"
}

variable "aws_alb_target_group_arn" {
  description = "ARN of the alb target group"
}

variable "service_desired_count" {
  description = "Number of services running in parallel"
}

variable "lb_sg" {
  description = "load balancer security group"
  type        = string
}
/* 
variable "container_environment" {
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
