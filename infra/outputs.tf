# Paste this into the frontend
output "contact_endpoint" {
  description = "POST here from the contact form"
  value       = "${aws_apigatewayv2_api.main.api_endpoint}/contact"
}

# DNS records — add these at your registrar
output "ses_domain_verification_record" {
  value = {
    type  = "TXT"
    name  = "_amazonses.${var.domain_name}"
    value = aws_ses_domain_identity.main.verification_token
  }
}

output "ses_dkim_records" {
  value = [
    for t in aws_ses_domain_dkim.main.dkim_tokens : {
      type  = "CNAME"
      name  = "${t}._domainkey.${var.domain_name}"
      value = "${t}.dkim.amazonses.com"
    }
  ]
}

output "ses_mail_from_records" {
  value = [
    {
      type  = "MX"
      name  = aws_ses_domain_mail_from.main.mail_from_domain
      value = "10 feedback-smtp.${var.aws_region}.amazonses.com"
    },
    {
      type  = "TXT"
      name  = aws_ses_domain_mail_from.main.mail_from_domain
      value = "v=spf1 include:amazonses.com ~all"
    }
  ]
}