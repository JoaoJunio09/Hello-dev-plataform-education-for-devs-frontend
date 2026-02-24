import { PostService } from '../../services/postService.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { Exceptions } from '../../exceptions/exceptions.js';
import { loadTemplate } from '../../utils/templateLoader.js';
import { rendererLoading } from '../../renderers/loadingRenderer.js';
import { PostStatus } from '../../models/enums/postStatus.js';

        const imgDefault = "../../../assets/images/248.jpg";

        // --- ESTADO DA APLICAÇÃO ---
        const state = {
            isAdmin: false,
            isMobileMenuOpen: false
        };

        // --- SELETORES DOM ---
        const dom = {
          adminToggleBtn: document.getElementById('admin-toggle-btn'),
          adminToolbar: document.getElementById('admin-toolbar'),
          header: document.getElementById('main-header'),
          newsletterBtn: document.getElementById('newsletter-btn'),
          mobileMenuBtn: document.getElementById('mobile-menu-btn'),
          mobileMenuDropdown: document.getElementById('mobile-menu-dropdown'),
          mobileMenuIcon: document.getElementById('mobile-menu-icon'),
          featuredContainer: document.getElementById('featured-article-container'),
          articlesGrid: document.getElementById('articles-grid'),
        };

        // --- FUNÇÕES DE RENDERIZAÇÃO (HTML Templates) ---

        // Renderiza o Artigo em Destaque
        async function renderFeaturedArticle(posts) {
            const article = posts[0];
            
            // HTML para o botão de admin (Overlay)
            const adminOverlay = state.isAdmin ? `
                <div class="absolute top-4 right-4 flex gap-2">
                     <button class="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors" title="Editar Destaque">
                        <i data-lucide="settings" width="18" height="18"></i>
                     </button>
                </div>
            ` : '';

            const html = `
                <div data-id="${article.id}" data-title="${article.title}" class="card-article group relative w-full bg-white rounded-3xl overflow-hidden shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300 border border-slate-100 flex flex-col lg:flex-row h-auto lg:h-[500px]">
                    <!-- Image Side -->
                    <div class="w-full lg:w-3/5 h-64 lg:h-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                        <img 
                            src="${article.thumbnail.url !== null ? article.thumbnail.url : imgDefault}"
                            alt="${article.title}" 
                            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div class="absolute top-6 left-6 z-20">
                            <span class="px-4 py-2 bg-white/90 backdrop-blur text-indigo-700 font-bold text-xs rounded-lg shadow-sm uppercase tracking-wide">
                                Destaque da Semana
                            </span>
                        </div>
                    </div>

                    <!-- Content Side -->
                    <div class="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center bg-white relative">
                         ${adminOverlay}

                        <div class="flex items-center gap-3 mb-4 text-sm font-medium text-slate-500">
                            <span class="text-indigo-600 font-bold">Tecnologia</span>
                            <span>•</span>
                            <span>${article.date}</span>
                        </div>
                        
                        <h2 class="text-3xl lg:text-4xl font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">
                            ${article.title}
                        </h2>
                        
                        <h3 class="text-xl text-slate-700 font-medium mb-6">
                            ${article.subTitle}
                        </h3>
                        
                        <p class="text-slate-500 leading-relaxed mb-8 text-lg line-clamp-4 lg:line-clamp-none">
                            ${article.description}
                        </p>
                        
                        <div class="flex items-center justify-between mt-auto">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                   <img src="https://ui-avatars.com/api/?name=Audor+Servover&background=random" alt="Avatar" />
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-slate-900">João Junio</p>
                                    <p class="text-xs text-slate-500">Software Developer</p>
                                </div>
                            </div>
                            
                            <button class="read-more-article w-12 h-12 rounded-full bg-slate-50 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all group-hover:translate-x-1 border border-slate-100">
                                <i data-lucide="chevron-right" width="24" height="24"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            dom.featuredContainer.innerHTML = html;
        }

        // Renderiza a Grid de Artigos
        async function renderArticlesGrid(posts) {
            const articles = posts.slice(1);
            
            const htmlArray = await Promise.all(
              articles.map(async article => {
                  // Admin Overlay
                  const adminOverlay = state.isAdmin ? `
                      <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm">
                          <button class="p-1.5 hover:text-indigo-600">
                              <i data-lucide="settings" width="16" height="16"></i>
                          </button>
                      </div>
                  ` : '';

                  return `
                  <article data-id="${article.id}" data-title="${article.title}" class="card-article bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 flex flex-col h-full group">
                      <!-- Card Image -->
                      <div class="relative h-56 overflow-hidden">
                          <img 
                              src="${article.thumbnail.url !== null ? article.thumbnail.url : imgDefault}"
                              alt="${article.title}" 
                              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                          <div class="absolute top-4 left-4">
                              <span class="px-3 py-1 bg-white/95 backdrop-blur text-indigo-700 text-xs font-bold rounded-md shadow-sm">
                                  Tecnologia
                              </span>
                          </div>
                          ${adminOverlay}
                      </div>

                      <!-- Card Content -->
                      <div class="p-6 flex flex-col flex-grow">
                          <div class="flex items-center gap-2 mb-3 text-xs font-medium text-slate-400">
                              <span>${article.date}</span>
                              <span>•</span>
                              <span>5 min de leitura</span>
                          </div>

                          <h3 class="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                              ${article.title}
                          </h3>
                          
                          <h4 class="text-sm font-medium text-indigo-500 mb-4 opacity-90">
                              ${article.subTitle}
                          </h4>

                          <p class="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                              ${article.description}
                          </p>

                          <div class="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                              <span class="text-xs font-bold text-slate-700 flex items-center gap-2">
                                  <i data-lucide="user" width="14" height="14" class="text-indigo-500"></i> João Junio
                              </span>
                              <span class="read-more-article text-indigo-600 text-sm font-bold group-hover:translate-x-1 transition-transform cursor-pointer">
                                  Ler artigo →
                              </span>
                          </div>
                      </div>
                  </article>
                  `;
              })
            );
            
            dom.articlesGrid.innerHTML = htmlArray.join('');
        }

        // Atualiza a UI baseada no estado
        async function updateUI(posts) {
            // Lógica Admin
            if (state.isAdmin) {
                dom.adminToggleBtn.textContent = "Admin";
                dom.adminToggleBtn.classList.remove('bg-slate-100', 'text-slate-500');
                dom.adminToggleBtn.classList.add('bg-indigo-600', 'text-white');
                
                dom.adminToolbar.classList.remove('hidden');
                dom.header.classList.remove('top-0');
                dom.header.classList.add('top-[60px]');
                
                dom.newsletterBtn.classList.add('hidden'); // Esconde newsletter no modo Admin
            } else {
                dom.adminToggleBtn.textContent = "Visitante";
                dom.adminToggleBtn.classList.remove('bg-indigo-600', 'text-white');
                dom.adminToggleBtn.classList.add('bg-slate-100', 'text-slate-500');
                
                dom.adminToolbar.classList.add('hidden');
                dom.header.classList.remove('top-[60px]');
                dom.header.classList.add('top-0');
                
                dom.newsletterBtn.classList.remove('hidden'); // Mostra newsletter no modo Visitante
            }

            // Lógica Menu Mobile
            if (state.isMobileMenuOpen) {
                dom.mobileMenuDropdown.classList.remove('hidden');
                // Troca ícone para X (usando atributo do lucide)
                dom.mobileMenuIcon.setAttribute('data-lucide', 'x');
            } else {
                dom.mobileMenuDropdown.classList.add('hidden');
                dom.mobileMenuIcon.setAttribute('data-lucide', 'menu');
            }

            // Re-renderiza conteúdo que muda visualmente com admin
            await renderFeaturedArticle(posts);
            await renderArticlesGrid(posts);
            
            // Recarrega ícones (necessário pois injetamos novo HTML)
            if (window.lucide) {
                lucide.createIcons();
            }
        }

        // --- EVENT LISTENERS ---

        // Toggle Admin
        dom.adminToggleBtn.addEventListener('click', async () => {
          state.isAdmin = !state.isAdmin;
          updateUI();
        });

        // Toggle Menu Mobile
        dom.mobileMenuBtn.addEventListener('click', async () => {
          state.isMobileMenuOpen = !state.isMobileMenuOpen;
          updateUI();
        });

        // Scroll Effect para Navbar
        window.addEventListener('scroll', () => {
          if (window.scrollY > 20) {
            dom.header.classList.remove('bg-white');
            dom.header.classList.add('scrolled-header');
          } else {
            dom.header.classList.add('bg-white');
            dom.header.classList.remove('scrolled-header');
          }
        });

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', async () => {
  await loadTemplate('../../../templates/loading.html');

  loading();

	try {
    localStorage.setItem('postId', "");
    localStorage.setItem('postTitle', "");
    const posts = await PostService.findAllPostsPageable(MediaTypes.JSON, {page: 0, size: 15, direction: 'asc'});
    if (posts._embedded.postDTOList.length === 0) throw new Exceptions.TheListIsEmptyException();

    const postList = posts._embedded.postDTOList.filter(post => post.status === PostStatus.PUBLISHED);

    await updateUI(postList);
    lucide.createIcons();

    readMoreArticle();
	} catch (e) {
		window.location.href = '../../../error.html';
	}
  finally {
    closeLoading();
  }
});

function readMoreArticle() {
  const btnsReadMore = document.querySelectorAll(".read-more-article");
  btnsReadMore.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest(".card-article");
      const postId = card.dataset.id;
      const postTitle = card.dataset.title;
      
      localStorage.setItem('postId', postId);
      localStorage.setItem('postTitle', postTitle);
      window.location.href = '../../../post.html';
    }); 
  })
}

function loading() {
  const loadingModal = rendererLoading();
  loadingModal.classList.add('active');
  document.body.classList.add('loading-active');
}

function closeLoading() {
  const loadingModal = document.getElementById("loading-modal");

  if (loadingModal) {
    loadingModal.classList.remove('active');
    loadingModal.remove();
  }
  
  document.body.classList.remove('loading-active');
}