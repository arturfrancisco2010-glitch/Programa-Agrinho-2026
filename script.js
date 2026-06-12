// --- Lógica do Menu mudando de cor ao rolar ---
const nav = document.getElementById('menu-topo');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// --- Efeito bonitinho dos elementos subindo e aparecendo (Fade In) ---
const observarElementos = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visivel');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animacao-fade').forEach((el) => {
  observarElementos.observe(el);
});

// --- Lógica da Sanfona (Acordeão) das dúvidas ---
// Deu um trabalho pra fazer a caixinha abrir macio com o max-height, 
// pq o css não anima direto no "height: auto". 
const botoesSanfona = document.querySelectorAll('.btn-sanfona');

botoesSanfona.forEach(btn => {
  btn.addEventListener('click', function() {
    const itemAtual = this.parentElement;
    const corpoAtual = this.nextElementSibling;
    
    // fecha os outros se estiverem abertos (opcional, mas fica mais limpo)
    document.querySelectorAll('.item-sanfona').forEach(item => {
      if (item !== itemAtual) {
        item.classList.remove('open');
        item.querySelector('.corpo-sanfona').style.maxHeight = null;
      }
    });

    // abre ou fecha o que a gente clicou
    itemAtual.classList.toggle('open');
    if (itemAtual.classList.contains('open')) {
      corpoAtual.style.maxHeight = corpoAtual.scrollHeight + "px";
    } else {
      corpoAtual.style.maxHeight = null;
    }
  });
});

// --- A Matemática do Simulador ---
// pegando os elementos HTML pra gente usar no JS
const btnCalc = document.getElementById('btn-rodar-calc');
const inputPeso = document.getElementById('inputPeso');
const selectTipo = document.getElementById('selectTipoLixo');
const boxResultados = document.getElementById('div-resultados');

// Taxas médias teóricas de m3 de biogás por kg de resíduo fresco 
// (Ajustado pra simular a realidade, de forma educacional e didática)
const taxaBiogasPorKg = {
  suino: 0.055,   
  bovino: 0.040,  
  avicola: 0.075, 
  misto: 0.050    
};

btnCalc.addEventListener('click', () => {
  const kgLixo = Number(inputPeso.value);

  // Validação rápida: se o cara não digitar nada, bloqueia
  if (!kgLixo || kgLixo <= 0) {
    alert("Ei, digita um valor de resíduo válido ali!");
    return;
  }

  const tipoEscolhido = selectTipo.value;
  const taxa = taxaBiogasPorKg[tipoEscolhido];

  // ==========================================
  // As Contas (Física/Química aplicadas):
  // ==========================================
  
  // 1. Biogás total gerado no dia
  const biogasDia = kgLixo * taxa;
  
  // 2. Metano (aprox 60% do biogás é metano útil)
  const metanoDia = biogasDia * 0.60;
  
  // 3. Energia (1 m3 de metano ~ 9.97 kWh térmico. Com eficiencia de gerador a 35% ~ 1.43 kWh elétrico por m3 de biogás total ou ~ 2.4 kWh/m3 de metano)
  const energiaKwh = biogasDia * 1.43;
  
  // 4. Biofertilizante/Digestato (cerca de 85% do peso inicial que entrou sai estabilizado no final)
  const aduboKg = kgLixo * 0.85;
  
  // 5. CO2 Equivalente evitado (GWP do metano é 28. Densidade do CH4 é 0.717 kg/m3)
  const kgMetano = metanoDia * 0.717;
  const co2Evitado = kgMetano * 28;
  
  // 6. Casas abastecidas (Considerando 165 kWh/mês por residência, que dá ~5.5 kWh por dia)
  const casasAbastecidas = energiaKwh / 5.5;

  // Jogando os resultados na tela com 1 ou 2 casas decimais pra não ficar número quebrado feio
  document.getElementById('rBiogas').innerText = biogasDia.toFixed(1);
  document.getElementById('rMetano').innerText = metanoDia.toFixed(1);
  document.getElementById('rEnergia').innerText = energiaKwh.toFixed(1);
  document.getElementById('rAdubo').innerText = aduboKg.toFixed(0);
  document.getElementById('rCO2').innerText = co2Evitado.toFixed(1);
  document.getElementById('rCasas').innerText = Math.floor(casasAbastecidas); // Arredondando casa pra baixo pq n existe meia casa rs

  // Mostra a div de resultados
  boxResultados.classList.add('show');
  
  // Rola a tela suavemente pros resultados pra o usuário notar que atualizou
  boxResultados.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
