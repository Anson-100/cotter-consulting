variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "aws_account_id" {
  description = "AWS account ID"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "domain_name" {
  description = "Domain name for SES email sending"
  type        = string
}

variable "sender_email" {
  description = "Email address that will send emails"
  type        = string
}

variable "test_recipient_email" {
  description = "Email address for testing in sandbox mode"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "pirate-ship"
}
