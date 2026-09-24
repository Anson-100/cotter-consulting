# Zips lambda/contact/ automatically on every apply
data "archive_file" "contact" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/contact"
  output_path = "${path.module}/build/contact.zip"
}

resource "aws_cloudwatch_log_group" "contact" {
  name              = "/aws/lambda/${local.contact_fn_name}"
  retention_in_days = 14
}

resource "aws_lambda_function" "contact" {
  function_name    = local.contact_fn_name
  role             = aws_iam_role.contact.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  architectures    = ["arm64"]
  filename         = data.archive_file.contact.output_path
  source_code_hash = data.archive_file.contact.output_base64sha256
  timeout          = 10
  memory_size      = 256

  environment {
    variables = {
      SENDER_EMAIL    = var.sender_email
      RECIPIENT_EMAIL = var.recipient_email
      CONFIG_SET      = aws_ses_configuration_set.main.name
      MIN_SUBMIT_MS   = tostring(var.min_submit_ms)
    }
  }

  depends_on = [aws_cloudwatch_log_group.contact]
}