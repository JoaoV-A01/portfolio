async function carregarDados() {
  const infoRes = await fetch("data/infos-pessoais.json");
  const projetosRes = await fetch("data/projetos-curriculares.json");

  const infos = await infoRes.json();
  const projetos = await projetosRes.json();

    const basePath = window.location.hostname.includes("github.io")
  ? "./img/PIs/"
  : "../img/PIs/";

  document.getElementById("foto-perfil").src = infos.foto || "img/perfil.jpg";
  document.getElementById("nome").textContent = infos.nome;

  const facul = infos.graduação;
  const dadosAcademicos = `
    <h2>Formação Acadêmica</h2>
    <p><strong>${facul.faculdade}</strong><br>
    ${facul.curso}<br>
    ${facul.datas}</p>
  `;
  document.getElementById("dados-academicos").innerHTML = dadosAcademicos;

  const exp = infos.trabalhos;
  const experiencias = `
    <h2>Experiência Profissional</h2>
    <p><strong>${exp.empresa}</strong> (${exp.datas})<br>
    <em>${exp.cargo}</em><br>
    ${exp.descrição || ""}<br>
    ${exp.atividades || ""}</p>
  `;
  document.getElementById("experiencias").innerHTML = experiencias;

  const cardsContainer = document.getElementById("cards-container");
  Object.values(projetos.PIs).forEach((pi, index) => {
  const imgPath = pi.Prints["1"] ? pi.Prints["1"].split("/").pop() : "default.png";
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${basePath}${imgPath}" alt="${pi.Nome}">
    <h3>${pi.Nome}</h3>
    <p>${pi.Descrição.substring(0, 100)}...</p>
    <a href="projeto.html?id=pi${index + 1}" class="btn">Ver detalhes</a>
  `;
    cardsContainer.appendChild(card);
  });

  const coursesContainer = document.getElementById("list-courses");
  Object.values(infos.cursosOnline).forEach((curso) => {
    const cardCurse = document.createElement("div");
    cardCurse.className = "course-card";
    cardCurse.innerHTML = `
      <h3>${curso.nome}</h3>
      <p><strong>Instituição:</strong> ${curso.instituição}</p>
      <p><strong>Local:</strong> ${curso.local}</p>
      <p><strong>Duração:</strong> ${curso.horas}</p>
      <p><strong>Data:</strong> ${curso.datas}</p>
    `;
    coursesContainer.appendChild(cardCurse);
  });

  const languagesContainer = document.getElementById("languages-container");
  Object.values(infos.idiomas).forEach((idioma) => {
    const language = document.createElement("div");
    language.className = "idioma";
    language.innerHTML = `
      <p>${idioma}</p><br>
    `;
    languagesContainer.appendChild(language);
  });

}

carregarDados();