# Proves you own cotterlegalnurse.com
resource "aws_ses_domain_identity" "main" {
  domain = var.domain_name
}

# DKIM signing — adds three CNAMEs to your DNS
resource "aws_ses_domain_dkim" "main" {
  domain = aws_ses_domain_identity.main.domain
}

# Custom MAIL FROM subdomain — better deliverability
resource "aws_ses_domain_mail_from" "main" {
  domain           = aws_ses_domain_identity.main.domain
  mail_from_domain = "mail.${var.domain_name}"
}

# Rae@ — sandbox requires the recipient to be verified too
resource "aws_ses_email_identity" "recipient" {
  email = var.recipient_email
}

# Tracks sending metrics (bounces, complaints)
resource "aws_ses_configuration_set" "main" {
  name = local.name_prefix
}