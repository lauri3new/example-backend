variable "name" {
  description = "the name of your stack, e.g. \"demo\""
  type        = string
}

variable "environment" {
  description = "the name of your environment, e.g. \"prod\""
  type        = string
}

variable "subnet_ids" {
  description = "list of subnet IDs"
  type        = list(string)
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "certificate_arn" {
  description = "The ARN of the certificate that the ALB uses for https"
  type        = string
}

variable "health_check_path" {
  description = "Path to check if the service is healthy, e.g. \"/status\""
  type        = string
}
