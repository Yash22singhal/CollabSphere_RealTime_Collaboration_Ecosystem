// import express from 'express';
// import fetch from 'node-fetch';  // Using native fetch for the request
// import dotenv from 'dotenv';

// dotenv.config();

// const router = express.Router();

// // POST /api/execute
// router.post('/execute', async (req, res) => {
//   const { source_code, language_id, stdin = '' } = req.body;

//   if (!source_code || !language_id) {
//     return res.status(400).json({ error: 'source_code and language_id are required.' });
//   }

//   try {
//     const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,  // Store your RapidAPI key in .env
//         'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
//       },
//       body: JSON.stringify({
//         source_code,
//         language_id,
//         stdin,
//       }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       return res.json(data);
//     } else {
//       throw new Error(data.message || 'Code execution failed');
//     }

//   } catch (err) {
//     console.error('Code execution error:', err.message);
//     res.status(500).json({ error: 'Failed to execute code' });
//   }
// });

// export default router;



import express from "express";
import https from "https";

const router = express.Router();

const encodeBase64 = (str) => Buffer.from(str).toString("base64");

router.post("/execute", async (req, res) => {
  const { source_code, language_id, stdin } = req.body;

  if (!source_code || !language_id) {
    return res.status(400).json({ error: "Missing source_code or language_id" });
  }

  const postData = JSON.stringify({
    language_id,
    source_code: encodeBase64(source_code),
    stdin: encodeBase64(stdin || ""),
  });

  const options = {
    method: "POST",
    hostname: "judge0-ce.p.rapidapi.com",
    port: null,
    path: "/submissions?base64_encoded=true&wait=true&fields=*",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  const request = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        const result = JSON.parse(data);

        // Combine stdout, stderr, and compile_output
        let output = "";

        if (result.stdout) output += Buffer.from(result.stdout, "base64").toString();
        if (result.stderr) output += "\n[stderr]\n" + Buffer.from(result.stderr, "base64").toString();
        if (result.compile_output) output += "\n[compile_output]\n" + Buffer.from(result.compile_output, "base64").toString();

        res.status(200).json({
          status: result.status,
          output: output.trim() || "No output",
        });
      } catch (err) {
        res.status(500).json({ error: "Failed to parse response from Judge0." });
      }
    });
  });

  request.on("error", (e) => {
    console.error("Request error:", e);
    res.status(500).json({ error: "Request to Judge0 failed." });
  });

  request.write(postData);
  request.end();
});

export default router;
