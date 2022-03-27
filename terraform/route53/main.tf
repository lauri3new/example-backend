resource "aws_route53_zone" "main" {
  name = var.domain_name

  tags = {
    Name        = "${var.name}-hz-${var.environment}"
    Environment = var.environment
  }
}

// currently records tracked in console
