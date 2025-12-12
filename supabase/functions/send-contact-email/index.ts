import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface MediaFile {
  type: 'image' | 'video' | 'drawing';
  url: string;
  name: string;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  mediaFiles?: MediaFile[];
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
    const { name, email, message, mediaFiles = [] }: ContactFormData = await req.json();

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

    // 构建媒体文件 HTML
    let mediaHtml = '';
    if (mediaFiles && mediaFiles.length > 0) {
      mediaHtml = `
        <div class="field">
          <span class="label">🎨 附件内容：</span>
          <div class="media-grid">
      `;
      
      for (const file of mediaFiles) {
        if (file.type === 'image' || file.type === 'drawing') {
          mediaHtml += `
            <div class="media-item">
              <img src="${file.url}" alt="${file.name}" style="max-width: 100%; border-radius: 8px; margin-bottom: 8px;" />
              <p style="font-size: 12px; color: #A8A8A8; margin: 0;">${file.name}</p>
            </div>
          `;
        } else if (file.type === 'video') {
          mediaHtml += `
            <div class="media-item">
              <div style="background: #FFF8F0; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 8px;">
                <p style="margin: 0 0 10px 0;">🎬 视频文件</p>
                <a href="${file.url}" style="color: #8B7355; text-decoration: none; padding: 8px 16px; border: 2px solid #D4B996; border-radius: 8px; display: inline-block;">点击查看视频</a>
              </div>
              <p style="font-size: 12px; color: #A8A8A8; margin: 0;">${file.name}</p>
            </div>
          `;
        }
      }
      
      mediaHtml += `
          </div>
        </div>
      `;
    }

    // 构建邮件内容
    const emailContent = {
      from: 'Egg Cabin <onboarding@resend.dev>', // Resend 的默认发件地址
      to: ['1660296253@qq.com'], // 您的邮箱
      reply_to: email, // 设置回复地址为留言者邮箱
      subject: `【蛋蛋小屋】来自 ${name} 的留言`,
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
              .media-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 16px;
                margin-top: 12px;
              }
              .media-item {
                background: #FFF8F0;
                padding: 12px;
                border-radius: 8px;
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
                <p class="subtitle">来自蛋蛋小屋的访客</p>
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
                
                ${mediaHtml}
              </div>
              
              <div class="footer">
                <div class="stamp">蛋蛋小屋 · 留言簿</div>
                <p style="margin-top: 15px;">这是一封来自您的个人网站的自动邮件</p>
                <p style="margin-top: 10px;">💡 提示：您可以直接回复此邮件与留言者联系</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
【蛋蛋小屋】新留言

访客姓名：${name}
联系邮箱：${email}

留言内容：
${message}

${mediaFiles && mediaFiles.length > 0 ? `
附件内容：
${mediaFiles.map(f => `- ${f.name}: ${f.url}`).join('\n')}
` : ''}
---
这是一封来自您的个人网站的自动邮件
💡 提示：您可以直接回复此邮件与留言者联系
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
