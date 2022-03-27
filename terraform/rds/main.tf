resource "aws_db_subnet_group" "main" {
  name       = "${var.name}-dbsg-${var.environment}"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "${var.name}-dbsg-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_db_parameter_group" "main" {
  name   = "${var.name}-pg-${var.environment}"
  family = "postgres14"
}

resource "aws_security_group" "main" {
  vpc_id = var.vpc_id

  ingress {
    protocol        = "tcp"
    from_port       = 5432
    to_port         = 5432
    security_groups = [var.ecs_sg]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.name}-sg-alb-${var.environment}"
    Environment = var.environment
  }

  lifecycle {
    ignore_changes = [ingress]
  }
}

resource "aws_db_instance" "main" {
  identifier             = "${var.name}-rds-${var.environment}"
  instance_class         = "db.t3.micro"
  engine                 = "postgres"
  engine_version         = "14.2"
  allocated_storage      = 5
  username               = var.username
  password               = var.password
  parameter_group_name   = aws_db_parameter_group.main.name
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.main.id]
  publicly_accessible    = true

  tags = {
    Name        = "${var.name}-rds-${var.environment}"
    Environment = var.environment
  }
}
