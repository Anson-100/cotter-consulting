variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Domain name for SES email sending"
  type        = string
}

variable "sender_email" {
  description = "Address the site sends from (must be on domain_name)"
  type        = string
}

variable "recipient_email" {
  description = "Where contact form submissions are delivered"
  type        = string
}

variable "allowed_origins" {
  description = "Origins permitted to call the API (CORS)"
  type        = list(string)
}

variable "min_submit_ms" {
  description = "Reject submissions faster than this (bot speed trap)"
  type        = number
  default     = 3000
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "cotter-consulting"
}