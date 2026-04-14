# SES Configuration
# Resources will be added here:
# - aws_ses_domain_identity (verify domain ownership)
# - aws_ses_domain_dkim (email authentication)
# - aws_ses_domain_mail_from (custom MAIL FROM domain)
# - IAM policy for sending emails

# SES Email Identity - verify your sending email address
resource "aws_ses_email_identity" "sender" {
  email = var.sender_email
}

# SES Email Identity - verify a test recipient email (for sandbox testing)
resource "aws_ses_email_identity" "test_recipient" {
  email = var.test_recipient_email
}

# Configuration Set - tracks email sending metrics
resource "aws_ses_configuration_set" "main" {
  name = "${var.app_name}-${var.environment}"
}