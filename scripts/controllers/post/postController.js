import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { PostService } from '../../services/postService.js';
import { loadTemplate } from '../../utils/templateLoader.js';
import { rendererPost } from '../../renderers/postRenderer.js';
import { rendererNextPosts } from '../../renderers/rendererNextPosts.js';
import { rendererCommentsSection } from '../../renderers/rendererCommentsSection.js';
import { rendererMascotInteractFocus } from '../../renderers/rendererMascotInteractFocus.js';
import { rendererLoading } from '../../renderers/loadingRenderer.js';
import { showToast } from '../../utils/toast.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadTemplate('../../../templates/post-content.html');
  await loadTemplate('../../../templates/next-posts.html');
  await loadTemplate('../../../templates/mascot-interact-focus.html');
  await loadTemplate('../../../templates/comments-section.html');
  await loadTemplate('../../../templates/comment-card.html');
  await loadTemplate('../../../templates/loading.html');

  loading();

  try {
    await loadPost();
    goToTheNextPost();
  }
  catch (e) {
    showToast({message: 'Não foi possível carregar o Artigo', type: 'info'});
    setTimeout(() => {
      window.location.href = '../../../posts.html';
    }, 4000);
  }
  finally {
    closeLoading();
  }
});

async function loadPost() {
	try {
		const postId = localStorage.getItem('postId');
		const postTitle = localStorage.getItem('postTitle');

		const post = await PostService.findByIdPost(postId, MediaTypes.JSON);
    displayPost(post);

		document.title = postTitle + " | HelloDev Blog";
	}
	catch (e) {
		throw e;
	}
}

async function displayPost(post) {
	try {
	  const htmlContent = marked.parse(post.content);
    const articleBody = document.querySelector('.article-body');

		fillInTheBannerAndTitleAndAuthor(post);
		rendererPost(htmlContent, articleBody);
    await displayNextsPosts(articleBody);
    rendererMascotInteractFocus(articleBody);
    rendererCommentsSection(post, articleBody);
		generateIndex();

    initializeButtons();
	}
	catch (e) {
		console.error("Error displaying post:", e);
	}
}

function initializeButtons() {
  const btnComment = document.querySelector(".btn-comment");
  const commentTextArea = document.querySelector("#comment-text");
  const commentUserName = document.querySelector("#comment-username");

  btnComment.addEventListener('click', () => {
    addComent(commentUserName.value, commentTextArea.value);
  });
}

async function addComent(username, comment) {
  console.log(username)
}

function goToTheNextPost() {
  const btns = document.querySelectorAll(".mini-card");
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest(".mini-card");
      const postId = card.dataset.id;
      const postTitle = card.dataset.title;

      localStorage.setItem('postId', postId);
      localStorage.setItem('postTitle', postTitle);

      window.location.href = "../../../post.html";
    });
  });
}

function fillInTheBannerAndTitleAndAuthor(post) {
  const titleElement = document.getElementById('title');
	const authorInfoElement = document.querySelector('.author-info span');
  const banner = document.querySelector(".hero-card-banner");
	titleElement.textContent = post.title;
	authorInfoElement.textContent = `Autor, João Junio • ${new Date(post.date).toLocaleDateString()}`;
  banner.src = post.banner !== null ? post.banner.url : "";
}

async function displayNextsPosts(articleBody) {
  const nextsPosts = await PostService.findAllPostsPageable(MediaTypes.JSON, {page:1, size: 6, direction: 'asc'});
  const posts = nextsPosts._embedded.postDTOList.slice(0, 3);
  rendererNextPosts(posts, articleBody);

  goToTheNextPost();
}

function generateIndex() {
    const article = document.querySelector('.article-body');
    const indexRoot = document.querySelector('.index-box ul');

    indexRoot.innerHTML = '';

    let currentSectionLi = null;

    article.querySelectorAll('h1,h2,h3').forEach(heading => {
      const id = heading.textContent
        .toLowerCase()
        .replace(/[^\w]+/g, '-');

      heading.id = id;

      if (heading.tagName === 'H1' || heading.tagName === 'H2') {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
        indexRoot.appendChild(li);
        currentSectionLi = li;
      }

      if (heading.tagName === 'H3' && currentSectionLi) {
        let subList = currentSectionLi.querySelector('.sub-index');

        if (!subList) {
          subList = document.createElement('ul');
          subList.classList.add('sub-index');
          currentSectionLi.appendChild(subList);
        }

        const subLi = document.createElement('li');
        subLi.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
        subList.appendChild(subLi);
      }
  });
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