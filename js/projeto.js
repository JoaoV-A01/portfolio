async function carregarProjeto() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const res = await fetch("data/projetos-curriculares.json");
  const projetos = await res.json();
  const projeto = projetos.PIs[id];

  if (!projeto) {
    document.body.innerHTML = "<h2>Projeto não encontrado</h2>";
    return;
  }

  const container = document.getElementById("projeto-detalhe");
  const prints = Object.values(projeto.Prints).filter(src => src);

  const basePath = window.location.hostname.includes("github.io")
    ? "./img/PIs/"
    : "../img/PIs/";

  const adjustedPrints = prints.map(src => {
    const fileName = src.split("/").pop();
    return `${basePath}${fileName}`;
  });

  container.innerHTML = `
    <h1>${projeto.Nome}</h1>
    <p>${projeto.Descrição}</p>
    <p><strong>Tecnologias:</strong> ${projeto.Tecnologias}</p>
    <p><strong>Participação:</strong> ${projeto.Participação}</p>
    <p><a href="${projeto.Github}" target="_blank">Ver no GitHub</a></p>
    ${projeto.Live ? `<p><a href="${projeto.Live}" target="_blank">Ver ao vivo</a></p>` : ""}

    ${adjustedPrints.length ? `
      <div class="carousel">
        <button class="prev">❮</button>
        <div class="carousel-track">
          ${adjustedPrints.map(src => `<img src="${src}" class="carousel-img" alt="print do projeto">`).join("")}
        </div>
        <button class="next">❯</button>
        <div class="carousel-thumbs">
          ${adjustedPrints.map((src, i) => `
            <img src="${src}" class="thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
          `).join("")}
        </div>
      </div>

      <!-- Lightbox -->
      <div id="lightbox" class="lightbox hidden">
        <span class="close">&times;</span>
        <img class="lightbox-img" src="">
        <button class="lb-prev">❮</button>
        <button class="lb-next">❯</button>
      </div>
    ` : ""}
  `;

  const track = document.querySelector(".carousel-track");
  const imgs = document.querySelectorAll(".carousel-img");
  const thumbs = document.querySelectorAll(".thumb");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  let currentIndex = 0;

  function atualizarCarrossel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    thumbs.forEach(t => t.classList.remove("active"));
    thumbs[currentIndex].classList.add("active");
  }

  nextBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % imgs.length;
    atualizarCarrossel();
  });

  prevBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    atualizarCarrossel();
  });

  thumbs.forEach(t => {
    t.addEventListener("click", () => {
      currentIndex = parseInt(t.dataset.index);
      atualizarCarrossel();
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const lbPrev = document.querySelector(".lb-prev");
  const lbNext = document.querySelector(".lb-next");
  const closeBtn = document.querySelector(".close");

  imgs.forEach((img, i) => {
    img.addEventListener("click", () => {
      lightbox.classList.remove("hidden");
      lightboxImg.src = img.src;
      currentIndex = i;
    });
  });

  lbNext.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % imgs.length;
    lightboxImg.src = imgs[currentIndex].src;
  });

  lbPrev.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    lightboxImg.src = imgs[currentIndex].src;
  });

  closeBtn.addEventListener("click", () => lightbox.classList.add("hidden"));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.add("hidden");
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") lightbox.classList.add("hidden");
  });
}

carregarProjeto();