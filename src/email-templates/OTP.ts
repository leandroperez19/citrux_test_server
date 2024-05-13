export const OTPTemplate = (message: string, userName: string) => {
    const template = `
	<!DOCTYPE html>
		<html lang="en">
		<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Summarizer Email</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				margin: 0;
				padding: 0;
				color: #7E88C3;
				line-height: 1.5;
			}

			.container {
				max-width: 600px;
				margin: 20px auto;
				padding: 20px;
				border-radius: 8px;
				background-color: #141625;
			}

			.header {
				text-align: center;
				padding-bottom: 20px;
				border-bottom: 1px solid #7E88C3;
				display: flex;
				align-items: center;
			}

			.header img {
				margin-right: 15px;
				height: 35px;
				display: inline-block;
			}

			.header h1 {
				font-size: 24px;
				margin: 0;
				color: #1F2ADE;
				display: inline-block;
			}

			.content {
				padding: 20px 0;
				text-align: center;
			}

			.content p {
				font-size: 16px;
				color: #DFE3FA;
			}

			.content p a {
				color: #1F2ADE;
				text-decoration: none;
			}

			.content h4 {
				font-size: 20px;
				font-weight: 600;
				margin: 10px auto;
				color: #FFF;
			}

			.footer {
				text-align: center;
				padding-top: 20px;
				border-top: 1px solid #7E88C3;
			}

			.footer p {
				font-size: 12px;
				margin: 0;
				color: #FFF;
			}
		</style>
		</head>
			<body>
			<div class="container">
				<div class="header">
					<img src="https://i.ibb.co/HTSxnn5/logo-full.png" alt="logo" border="0">
				</div>

				<div class="content">
					<p>
						Hi, ${userName}!
						We received a request to recover your SummarAIzer password. 
						To verify your identity, please use the code below within the next 5 minutes.
						If you didn't request this change, reach support at <a href="mailto:summaraizer@gmail.com">summarizer@gmail.com</a>.
					</p>
					<h4>${message}</h4>
				</div>


				<div class="footer">
					<p>&copy; 2024 Summarizer</p>
				</div>
			</div>
			</body>
		</html>
	`;
	return template;
};
