 import { PostService } from '../../services/postService.js';
import { Post } from '../../models/post.js';
import { Exceptions } from '../../exceptions/exceptions.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { PostImageCategory } from '../../models/enums/postImageCategory.js';
import { showToast } from '../../utils/toast.js';
import { PostStatus } from '../../models/enums/postStatus.js';

const dom = {
	createPostBtn: document.querySelector("#create-article-btn"),
	draftPostBtn: document.querySelector("#draft-article-btn"),
	cancelBtn: document.querySelector(".btn-ghost"),
	bannerInput: document.querySelector("#banner"),
	thumbnailInput: document.querySelector("#thumbnail"),
	bannerPreview: document.querySelector("#banner-preview"),
	thumbnailPreview: document.querySelector("#thumbnail-preview"),
	bannerCard: document.querySelector(".banner-upload"),
	thumbnailCard: document.querySelector(".thumb-upload"),
	modalErrorDataIsNullOrEmpty: document.getElementById('error-modal'),
  closemodalErrorDataIsNullOrEmpty: document.getElementById('close-modal'),
};

const imagesFromPost = {
	banner: null,
	thumbnail: null,
	bannerUpdate: null,
	thumbnailUpdate: null,
};

const libraries = {
	quill: null,
	turndownService: null
};

dom.bannerInput.addEventListener('change', () => {
	showPreview(dom.bannerInput, dom.bannerPreview, dom.bannerCard);
});

dom.thumbnailInput.addEventListener('change', () => {
	showPreview(dom.thumbnailInput, dom.thumbnailPreview, dom.thumbnailCard);
});

dom.createPostBtn.addEventListener('click', async () => {
	try {
		captureBannerAndThumbnail();
		await buildPost(PostStatus.PUBLISHED, Number.parseInt(localStorage.getItem('postIdUpdate')))
		.then();
		showToast({message: 'Artigo Publicado com sucesso', type: 'success'});
		setTimeout(() => {
			window.location.href = '../../../postManager.html';
		}, 4000);
	}
	catch (e) {
		if (e instanceof Exceptions.TheDataIsEmptyOsNull) openErrorTheDataIsNullOrEmptyModal();
		showToast({message: 'Não foi possível publicar Artigo', type: 'error'});
	}
});

dom.draftPostBtn.addEventListener('click', async () => {
	try {
		captureBannerAndThumbnail();
		await buildPost(PostStatus.DRAFT, Number.parseInt(localStorage.getItem('postIdUpdate')));
		showToast({message: 'Rascunho salvo com sucesso', type: 'success'});
		setTimeout(() => {
			window.location.href = '../../../postManager.html';
		}, 4000);
	}
	catch (e) {
		if (e instanceof Exceptions.TheDataIsEmptyOsNull) openErrorTheDataIsNullOrEmptyModal();
		showToast({message: 'Não foi possível salvar Rascunho', type: 'error'});
	}
});

dom.cancelBtn.addEventListener('click', () => {
	window.location.href = '../../../postManager.html';
});

dom.closemodalErrorDataIsNullOrEmpty.addEventListener('click', closeErrorTheDataIsNullOrEmptyModal);

dom.modalErrorDataIsNullOrEmpty.addEventListener('click', (e) => {
  if (e.target === dom.modalErrorDataIsNullOrEmpty) closeErrorTheDataIsNullOrEmptyModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dom.modalErrorDataIsNullOrEmpty.classList.contains('active')) {
    closeErrorTheDataIsNullOrEmptyModal();
  }
});

document.addEventListener('DOMContentLoaded', async () => {
	initializeQuillAndTurndown();
	const postId = localStorage.getItem('postIdUpdate');
	if (postId !== "") {
		getPost({ postId: Number.parseInt(postId) });
	}
});

async function getPost({ postId }) {
	try {
		if (postId !== null) {
			const post = await PostService.findByIdPost(postId, MediaTypes.JSON);

			document.querySelector(".input-title").value = post.title;
			document.querySelector(".input-subtitle").value = post.subTitle;
			document.querySelector(".input-description").value = post.description;
			document.querySelector("#username").value = post.userDTO.username;

			const html = marked.parse(post.content);
			libraries.quill.root.innerHTML = html;

			if (post.banner) {
				dom.bannerPreview.src = post.banner.url;
				dom.bannerPreview.dataset.fileId = post.banner.fileId;
				dom.bannerPreview.style.display = "block";

				const span = dom.bannerCard.querySelector("span");
				if (span) {
					span.style.display = "none";
				}
			}

			if (post.thumbnail) {
				dom.thumbnailPreview.src = post.thumbnail.url;
				dom.thumbnailPreview.dataset.fileId = post.thumbnail.fileId;
				dom.thumbnailPreview.style.display = "block";

				const span = dom.thumbnailCard.querySelector("span");
				if (span) {
					span.style.display = "none";
				}
			}

			return;
		}
	} catch (e) {
		throw e;
	}
}

async function buildPost(status, postIdUpdate) {
	imagesFromPost.banner = imagesFromPost.banner || null;
	imagesFromPost.thumbnail = imagesFromPost.thumbnail || null;

	const title = document.querySelector(".input-title").value;
	const subTitle = document.querySelector(".input-subtitle").value;
	const description = document.querySelector(".input-description").value;
	const username = document.querySelector("#username").value = "jotajota";
	const htmlContent = libraries.quill.root.innerHTML;
	const markdown = libraries.turndownService.turndown(htmlContent);

	if (!title || !subTitle || !description || !markdown) {
		throw new Exceptions.TheDataIsEmptyOsNull("Fill in all the information.");
	}

	let post = new Post(
		title,
		subTitle,
		description,
		markdown,
		formatDate(new Date().toLocaleDateString()),
		status,
		"FRONTEND",
		{ username: username }
	);

	let postSaved = null;
	const uploads = [];

	if (postIdUpdate && !isNaN(postIdUpdate)) {
		const fileIdBannerRemove = document.querySelector("#banner-preview").dataset.fileId;
		const fileIdThumbnailRemove = document.querySelector("#thumbnail-preview").dataset.fileId;
	
		if (fileIdBannerRemove !== undefined) {
			uploads.push(
				PostService.updateImageFromPost(
					imagesFromPost.banner,
					fileIdBannerRemove,
					postIdUpdate,
					PostImageCategory.BANNER
				)
			);
		}
		else {
			uploads.push(
				PostService.uploadImageFromPost(
					imagesFromPost.banner,
					postSaved.id,
					PostImageCategory.BANNER
				)
			);
		}

		if (fileIdThumbnailRemove !== undefined) {
			uploads.push(
				PostService.updateImageFromPost(
					imagesFromPost.thumbnail,
					fileIdThumbnailRemove,
					postIdUpdate,
					PostImageCategory.THUMBNAIL
				)
			);
		}
		else {
			uploads.push(
				PostService.uploadImageFromPost(
					imagesFromPost.thumbnail,
					postSaved.id,
					PostImageCategory.THUMBNAIL
				)
			);
		}

		post.id = postIdUpdate;
		postSaved = await PostService.updatePost(post, MediaTypes.JSON);
	}
	else {
		postSaved = await PostService.createPost(post, MediaTypes.JSON);

		if (!postIdUpdate && (!imagesFromPost.banner || !imagesFromPost.thumbnail)) {
			throw new Exceptions.BannerOrThumbnailIsNullException("The Banner or Thumbnail is invalid");
		}

		if (imagesFromPost.banner) {
			uploads.push(
				PostService.uploadImageFromPost(
					imagesFromPost.banner,
					postSaved.id,
					PostImageCategory.BANNER
				)
			);
		}

		if (imagesFromPost.thumbnail) {
			uploads.push(
				PostService.uploadImageFromPost(
					imagesFromPost.thumbnail,
					postSaved.id,
					PostImageCategory.THUMBNAIL
				)
			);
		}
	}

	if (uploads.length > 0) {
		await Promise.all(uploads);
	}
}

function formatDate(date) {
	const day = date.slice(0, 2);
	const month = date.slice(3, 5);
	const age = date.slice(6, 10);
	return `${age}-${month}-${day}`;
}

function captureBannerAndThumbnail() {
	const bannerFile = dom.bannerInput.files[0];
	const thumbnailFile = dom.thumbnailInput.files[0];

	if (bannerFile) {
		const formDataBanner = new FormData();
		formDataBanner.append('image', bannerFile);
		imagesFromPost.banner = formDataBanner;
	}

	if (thumbnailFile) {
		const formDataThumbnail = new FormData();
		formDataThumbnail.append('image', thumbnailFile);
		imagesFromPost.thumbnail = formDataThumbnail;
	}
}

function showPreview(input, previewImg, card) {
	const file = input.files[0];
	if (!file) return;

	const url = URL.createObjectURL(file);

	if (previewImg.src !== null) {
		previewImg.src = url;
	}
	else {
		previewImg.src = url;
	}
	previewImg.style.display = "block";

	const span = card.querySelector("span");
	if (span) span.style.display = "none";
}

function openErrorTheDataIsNullOrEmptyModal() {
  dom.modalErrorDataIsNullOrEmpty.classList.add('active');
  document.body.classList.add('modal-open');
}

function closeErrorTheDataIsNullOrEmptyModal() {
  dom.modalErrorDataIsNullOrEmpty.classList.remove('active');
  document.body.classList.remove('modal-open');
}

function initializeQuillAndTurndown() {
	libraries.quill = new Quill('#editor', {
			theme: 'snow',
			placeholder: 'Escreva seu artigo aqui...',
			modules: {
					toolbar: [
							[{ header: [1, 2, 3, false] }],
							['bold', 'italic', 'underline', 'strike'],
							[{ list: 'ordered' }, { list: 'bullet' }],
							['blockquote', 'code-block'],
							['link'],
							['clean']
					]
			}
	});

	libraries.turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
	});
}