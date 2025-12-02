import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    // 解析请求数据
    const { name, email, message }: ContactFormData = await req.json();

    // 验证必填字段
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '请填写所有必填字段' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '邮箱格式不正确' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // 获取 Resend API Key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY 未配置');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '邮件服务配置错误，请联系管理员' 
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // 构建邮件内容
    const emailContent = {
      from: 'Warm Cabin <onboarding@resend.dev>', // Resend 的默认发件地址
      to: ['1660296253@qq.com'], // 您的邮箱
      subject: `【温暖小木屋】来自 ${name} 的留言`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Noto Serif SC', serif;
                background-color: #FFF8F0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px dashed #D4B996;
              }
              .title {
                font-size: 28px;
                color: #8B7355;
                margin: 0;
              }
              .subtitle {
                font-size: 14px;
                color: #A8A8A8;
                margin-top: 8px;
              }
              .content {
                margin: 30px 0;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-weight: bold;
                color: #8B7355;
                margin-bottom: 8px;
                display: block;
              }
              .value {
                color: #333;
                line-height: 1.6;
                padding: 12px;
                background: #FFF8F0;
                border-radius: 8px;
              }
              .message-box {
                background: #FFF8F0;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #A8C09A;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px dashed #D4B996;
                color: #A8A8A8;
                font-size: 12px;
              }
              .stamp {
                display: inline-block;
                padding: 8px 16px;
                border: 2px dashed #D4B996;
                border-radius: 8px;
                color: #8B7355;
                font-size: 12px;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 class="title">📮 新的留言</h1>
                <p class="subtitle">来自温暖小木屋的访客</p>
              </div>
              
              <div class="content">
                <div class="field">
                  <span class="label">👤 访客姓名：</span>
                  <div class="value">${name}</div>
                </div>
                
                <div class="field">
                  <span class="label">📧 联系邮箱：</span>
                  <div class="value">${email}</div>
                </div>
                
                <div class="field">
                  <span class="label">💌 留言内容：</span>
                  <div class="message-box">${message}</div>
                </div>
              </div>
              
              <div class="footer">
                <div class="stamp">温暖小木屋 · 留言簿</div>
                <p style="margin-top: 15px;">这是一封来自您的个人网站的自动邮件</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
【温暖小木屋】新留言

访客姓名：${name}
联系邮箱：${email}

留言内容：
${message}

---
这是一封来自您的个人网站的自动邮件
      `.trim(),
    };

    // 发送邮件
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailContent),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Resend API 错误：', responseData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '邮件发送失败，请稍后重试' 
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // 成功发送
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '留言已成功发送！',
        emailId: responseData.id 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    console.error('处理请求时出错：', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
