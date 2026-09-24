# Lets Lambda assume this role
data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "contact" {
  name               = "${local.name_prefix}-contact-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

# CloudWatch logs
resource "aws_iam_role_policy_attachment" "contact_logs" {
  role       = aws_iam_role.contact.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Send only, only from contact@
data "aws_iam_policy_document" "ses_send" {
  statement {
    actions = ["ses:SendEmail", "ses:SendRawEmail"]
    resources = [
      aws_ses_domain_identity.main.arn,
      aws_ses_configuration_set.main.arn,
    ]
    condition {
      test     = "StringEquals"
      variable = "ses:FromAddress"
      values   = [var.sender_email]
    }
  }
}

resource "aws_iam_role_policy" "ses_send" {
  name   = "${local.name_prefix}-ses-send"
  role   = aws_iam_role.contact.id
  policy = data.aws_iam_policy_document.ses_send.json
}