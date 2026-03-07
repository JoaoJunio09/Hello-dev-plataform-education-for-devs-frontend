import { PostService } from '../../services/postService.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { loadTemplate } from '../../utils/templateLoader.js';
import { rendererTBodyPostsManager } from '../../renderers/rendererTBodyPostsManager.js';
import { rendererLoading } from '../../renderers/loadingRenderer.js';
import { PostStatus } from '../../models/enums/postStatus.js';
import { Exceptions } from '../../exceptions/exceptions.js';
import { PostCategory } from '../../models/enums/postCategory.js';
import { showToast } from '../../utils/toast.js';

export let dom = {
	button_next_page: document.querySelector("#button-next-page"),
	button_previous_page: document.querySelector("#button-previous-page"),
	search: document.querySelector("#search-articles"),
	filter: {
		filterStatus: document.querySelector("#filter-status"),
		filterCategory: document.querySelector("#filter-category"),
	},
	page: {
		size: null,
		totalElements: null,
		totalPages: null,
		currentPageNumber: 0, // sempre inicializa como 0 (ZERO)
		listLength: null
	},
	previewPanel: {
		totalArticles: document.querySelector("#total-articles"),
		views: document.querySelector("#views"),
		totalLikes: document.querySelector("#likes"),
		drafts: document.querySelector("#drafts")
	},
	postInformation: {
		currentPageNumberControl: document.querySelector("#current-page-control"),
	},
};

export let paginationControlVariables = {
	filter: { status: PostStatus.ALL, category: PostCategory.ALL, currentFilter: null },
};

document.addEventListener('DOMContentLoaded', async () => {
	lucide.createIcons();
	localStorage.setItem('postIdUpdate', "");
	await loadTemplate('../../../templates/tbody-posts-manager.html');
	await loadTemplate('../../../templates/loading.html');

	loading();

	try {
		await fillInTheInformationOnThePreviewPanel();
		initializeDom();
	} catch (e) {
		if (e instanceof Exceptions.ServerConnectionException) window.location.href = '../../../error.html';
	} finally {
		closeLoading();
	}
});

async function fillInTheInformationOnThePreviewPanel() {
	fillInGeneralInformationAboutThePosts();

	const list = await PostService.findAllPostsPageable(
		MediaTypes.JSON, 
		{ page: dom.page.currentPageNumber, size: 4, direction: 'asc' }
	);
	await renderPostsAndUpdatePaginationControl(list, false);

	if (window.lucide) {
    lucide.createIcons();
  }
}

async function fillInGeneralInformationAboutThePosts() {
	const posts = await PostService.findAllPosts(MediaTypes.JSON);

	const totalArticles = posts.length;
	const views = 0; // Implementar no backend service para contar visualizações através dos acessos a cada posts.
	const likes = 0; // LikeService.findAllLikesInPosts();
	const drafts = posts.filter(post => post.status === PostStatus.DRAFT).length;

	document.querySelector("#total-articles").textContent = totalArticles;
	document.querySelector("#views").textContent = views;
	document.querySelector("#likes").textContent = likes;
	document.querySelector("#drafts").textContent = drafts;
}

export async function renderPostsAndUpdatePaginationControl(list, update) {
	const posts = list._embedded.postDTOList;
	rendererTBodyPostsManager(posts, document.querySelector("#body-table-posts-manager"), update);
	updatePaginationControl(list);
	initializeButtonsPost();
}

function updatePaginationControl(list) {
	updatePaginationData(list);

	const currentPage = document.querySelector("#current-page");
	const totalPages = document.querySelector("#total-pages");
	const postsLength = document.querySelector("#posts-length");
	const totalElements = document.querySelector("#total-elements");

	currentPage.textContent = dom.page.currentPageNumber + 1;
	totalPages.textContent = dom.page.totalPages;
	postsLength.textContent = dom.page.listLength;
	totalElements.textContent = dom.page.totalElements;

	dom.postInformation.currentPageNumberControl.textContent = currentPage.textContent;

	if (dom.page.currentPageNumber === 0) {
		dom.button_previous_page.style.display = 'none';
	}
	else {
		dom.button_previous_page.style.display = 'initial';
	}

	if (dom.page.totalPages > 1) {
		dom.button_next_page.style.display = 'initial';
	}

	if (dom.page.totalPages - dom.page.currentPageNumber === 1) {
		dom.button_next_page.style.display = 'none';
	}
}

function updatePaginationData(list) {
	dom.page.size = list.page.size;
	dom.page.totalElements = list.page.totalElements;
	dom.page.totalPages = list.page.totalPages;
	dom.page.currentPageNumber = list.page.number;
	dom.page.listLength = list._embedded.postDTOList.length;
}

function initializeButtonsPost() {
	document.querySelectorAll("#btn-edit").forEach(btn => {
		btn.addEventListener('click', async (event) => {
			edit(event);
		});
	});

	document.querySelectorAll("#btn-share").forEach(btn => {
		btn.addEventListener('click', async (event) => {
			console.log("clico");
		});
	});

	document.querySelectorAll("#btn-remove").forEach(btn => {
		btn.addEventListener('click', async (event) => {
			remove(event);
		});
	});
}

async function edit(event) {
	const postId = event.target.closest(".table-row-hover").dataset.id;
	const post = await PostService.findByIdPost(postId, MediaTypes.JSON);
	if (post !== null) {
		localStorage.setItem('postIdUpdate', postId);
		window.location.href = '../../../createPost.html';
	}
}

async function remove(event) {
	const postId = event.target.closest(".table-row-hover").dataset.id;
	const response_status = await PostService.deletePost(postId, MediaTypes.JSON);

	if (response_status === 204 ) {
		showToast({message: 'Post excluído com sucesso', type: 'success'});
		setTimeout(() => { location.reload() }, 2000);
	}
	else {
		showToast({message: 'Não foi possível excluir Post', type: 'error'});
	}
}

function initializeDom() {
	dom.postActions.btnsToShare = document.querySelectorAll(".btn-share");
	dom.postActions.btnsEdit = document.querySelectorAll(".btn-edit");
	dom.postActions.btnsRemove = document.querySelectorAll(".btn-remove");
	dom.postInformation.status = document.querySelectorAll(".status");
	dom.postInformation.viewsInfoForPost = document.querySelectorAll(".views-info");
	dom.postInformation.likesInfoForPost = document.querySelectorAll(".likes-info");
	dom.postInformation.date = document.querySelectorAll(".date");
	dom.postInformation.days = document.querySelectorAll(".days");
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