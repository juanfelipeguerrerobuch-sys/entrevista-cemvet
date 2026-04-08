import express from 'express';

const app = express();
app.use(express.json());

app.post('/api', async (req, res) => {
  const respuestas = req.body;

  const prompt = `
Analiza psicológicamente este candidato para el cargo de asistente administrativo en una clínica veterinaria.

Evalúa:
- Actitud
- Inteligencia emocional
- Servicio al cliente
- Manejo de estrés
- Organización
- Trabajo en equipo

Respuestas del candidato:
${JSON.stringify(respuestas, null, 2)}

Entrega:
1. Perfil psicológico
2. Fortalezas
3. Debilidades
4. Riesgos
5. Conclusión clara: APTO o NO APTO
`;

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await openaiResponse.json();

    console.log("ANÁLISIS DEL CANDIDATO:\n", data.choices[0].message.content);

    res.json({ ok: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en análisis' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Servidor activo en puerto " + PORT));
