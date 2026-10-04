import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json());
app.use(express.static("."));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/generate", async (req, res) => {
  try {
    const {
      grade,
      subject,
      type,
      duration,
      level,
      topic,
      notes
    } = req.body;

    const prompt = `
أنت مساعد ذكي محترف لمعلمات رياض الأطفال.

أنشئ محتوى مناسبًا لمرحلة:
${grade}

المادة:
${subject}

نوع المحتوى:
${type}

المدة:
${duration}

مستوى الأطفال:
${level}

الموضوع:
${topic}

تفاصيل إضافية:
${notes || "لا توجد"}

راعِ أن يكون المحتوى:
- مناسبًا لرياض الأطفال
- بسيطًا وممتعًا
- قائمًا على اللعب والحركة
- مناسبًا لعمر الطفل
- عمليًا وقابلًا للتطبيق داخل الفصل
- يتضمن دعمًا للأطفال الذين يحتاجون مساعدة
- يتضمن إثراءً للأطفال المتقدمين عند الحاجة

اكتب الرد بالعربية الفصحى المبسطة.
`;

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: prompt
    });

    res.json({
      result: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "حدث خطأ أثناء إنشاء المحتوى"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
