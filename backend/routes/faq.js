import { Router } from "express";

export default function createFaqRoutes() {
  const router = Router();

  // POST /api/faq → Envia mensagem para o FAQ
  router.post("/", async (req, res) => {
    const supabase = req.app.get("supabase"); // Obtém o cliente Supabase configurado
    const { nome, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    try {
      // Insere o registro
      const { data, error } = await supabase
        .from("tb_faq")
        .insert([{ nome, email, mensagem }])
        .select()
        .single(); // retorna o registro inserido

      if (error) throw error;

      res.status(201).json({ faq: data });
    } catch (error) {
      console.error("Erro ao salvar FAQ:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/faq → Lista mensagens do FAQ
  router.get("/", async (req, res) => {
    const supabase = req.app.get("supabase"); // Obtém o cliente Supabase configurado
    try {
      const { data, error } = await supabase
        .from("tb_faq")
        .select("*")
        .order("data_envio", { ascending: false })
        .limit(50);

      if (error) throw error;

      res.json({ faqs: data });
    } catch (error) {
      console.error("Erro ao buscar FAQs:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}