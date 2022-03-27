output "id" {
  value = aws_vpc.main.id
}

output "public_subnet_1" {
  value = aws_subnet.public_1
}

output "public_subnet_2" {
  value = aws_subnet.public_2
}
