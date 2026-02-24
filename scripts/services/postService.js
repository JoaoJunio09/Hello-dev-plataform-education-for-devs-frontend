import { Exceptions } from "../exceptions/exceptions.js";

const BASE_URL = "http://localhost:8080";
const FIND_ALL_POSTS_URL = `${BASE_URL}/api/posts/v1`;
const FIND_ALL_POSTS_PAGEABLE_URL = `${BASE_URL}/api/posts/v1/pageable?page={page}&size={size}&direction={direction}`;
const FIND_ALL_POSTS_BY_STATUS_PAGEABLE_URL = `${BASE_URL}/api/posts/v1/by-status?status={status}&page={page}&size={size}&direction={direction}`;
const FIND_ALL_POSTS_BY_CATEGORY_PAGEABLE_URL = `${BASE_URL}/api/posts/v1/by-category?category={category}&page={page}&size={size}&direction={direction}`;
const FIND_ALL_POSTS_BY_STATUS_AND_CATEGORY_PAGEABLE_URL = `${BASE_URL}/api/posts/v1/by-status-and-category?status={status}&category={category}&page={page}&size={size}&direction={direction}`;
const FIND_POST_BY_ID_URL = `${BASE_URL}/api/posts/v1/{postId}`;
const CREATE_POST_URL = `${BASE_URL}/api/posts/v1`;
const UPLOAD_IMAGE_FROM_POST_URL = `${BASE_URL}/api/posts/v1/uploadImageFromPost/{postId}?category={category}`;
const GET_IMAGE_FROM_POST_URL = `${BASE_URL}/api/posts/v1/getImageFromPost/{fileId}`;
const UPDATE_POST_URL = `${BASE_URL}/api/posts/v1`;
const UPDATE_IMAGE_FROM_POST_URL = `${BASE_URL}/api/posts/v1/updateImageFromPost/{fileIdRemove}/{postId}?category={category}`;
const DELETE_POST_URL = `${BASE_URL}/api/posts/v1/{postId}`;

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJpYXQiOjE3NzE5NDU3MjUsImV4cCI6MTc3MTk0OTMyNSwic3ViIjoiam90YWpvdGEiLCJyb2xlcyI6W119.-RGw8Ixqhb0dje8uvLi0UbSmmCcBTO6uF3Fd8SAooBo";

async function findAllPageable(contentType, pageable) {
	try {
		const urlPage = FIND_ALL_POSTS_PAGEABLE_URL.replace("{page}", pageable.page);
		const urlSize = urlPage.replace("{size}", pageable.size);
		const url = urlSize.replace("{direction}", pageable.direction);
		const response = await fetch(url, {
			'method': 'GET',
			'headers':{
				'Accept': contentType
			}
		});

		if (response.status === 500) {
			throw new Exceptions.ServerConnectionException("Internal Server Error while fetching posts.");
		}

		if (!response.ok) {
			throw new Error(`Error fetching [findAll] posts: ${response.statusText}`);
		}

		return await response.json();
	}
	catch (e) {
		if (e instanceof Exceptions.ServerConnectionException) throw e;
	}
}

async function findAll(contentType) {
	try {
		const response = await fetch(FIND_ALL_POSTS_URL, {
			'method': 'GET',
			'headers':{
				'Accept': contentType
			}
		});

		if (response.status === 500) {
			throw new Exceptions.ServerConnectionException("Internal Server Error while fetching posts.");
		}

		if (!response.ok) {
			throw new Error(`Error fetching [findAll] posts: ${response.statusText}`);
		}

		return await response.json();
	}
	catch (e) {
		if (e instanceof Exceptions.ServerConnectionException) throw e;
	}
}

async function findAllPageableByStatus(contentType, pageable, status) {
	try {
		const urlStatus = FIND_ALL_POSTS_BY_STATUS_PAGEABLE_URL.replace("{status}", status);
		const urlPage = urlStatus.replace("{page}", pageable.page);
		const urlSize = urlPage.replace("{size}", pageable.size);
		const url = urlSize.replace("{direction}", pageable.direction);
		const response = await fetch(url, {
			'method': 'GET',
			'headers':{
				'Accept': contentType
			}
		});

		if (response.status === 500) {
			throw new Exceptions.ServerConnectionException("Internal Server Error while fetching posts.");
		}

		if (!response.ok) {
			throw new Error(`Error fetching [findAll] posts: ${response.statusText}`);
		}

		return await response.json();
	}
	catch (e) {
		if (e instanceof Exceptions.ServerConnectionException) throw e;
	}
}

async function findAllPageableByCategory(contentType, pageable, category) {
	try {
		const urlCategory = FIND_ALL_POSTS_BY_CATEGORY_PAGEABLE_URL.replace("{category}", category);
		const urlPage = urlCategory.replace("{page}", pageable.page);
		const urlSize = urlPage.replace("{size}", pageable.size);
		const url = urlSize.replace("{direction}", pageable.direction);
		const response = await fetch(url, {
			'method': 'GET',
			'headers':{
				'Accept': contentType
			}
		});

		if (response.status === 500) {
			throw new Exceptions.ServerConnectionException("Internal Server Error while fetching posts.");
		}

		if (!response.ok) {
			throw new Error(`Error fetching [findAll] posts: ${response.statusText}`);
		}

		return await response.json();
	}
	catch (e) {
		if (e instanceof Exceptions.ServerConnectionException) throw e;
	}
}

async function findAllPageableByStatusAndCategory(contentType, pageable, status, category) {
	try {
		const urlStatus = FIND_ALL_POSTS_BY_STATUS_AND_CATEGORY_PAGEABLE_URL.replace("{status}", status);
		const urlCategory = urlStatus.replace("{category}", category);
		const urlPage = urlCategory.replace("{page}", pageable.page);
		const urlSize = urlPage.replace("{size}", pageable.size);
		const url = urlSize.replace("{direction}", pageable.direction);
		const response = await fetch(url, {
			'method': 'GET',
			'headers':{
				'Accept': contentType
			}
		});

		if (response.status === 500) {
			throw new Exceptions.ServerConnectionException("Internal Server Error while fetching posts.");
		}

		if (!response.ok) {
			throw new Error(`Error fetching [findAll] posts: ${response.statusText}`);
		}

		return await response.json();
	}
	catch (e) {
		if (e instanceof Exceptions.ServerConnectionException) throw e;
	}
}

async function findById(postId, contentType) {
	const url = FIND_POST_BY_ID_URL.replace("{postId}", postId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers':{
			'Accept': contentType
		}
	});

	if (!response.ok) {
		console.log(response)
		throw new Error(`Error fetching [findById] post: ${response.statusText}`);
	}

	return await response.json();
}

async function create(post, contentType) {
	const response = await fetch(CREATE_POST_URL, {
		'method': 'POST',
		'headers': {
			'Content-Type': contentType,
			'Authorization': `Bearer ${TOKEN}`
		},
		'body': JSON.stringify(post)
	});

	if (!response.ok) {
		throw new Error(`Error creating post: ${response.statusText}`, response.text);
	}

	return await response.json();
}

async function uploadImageFromPost(imageFormData, postId, category) {
	const urlPostId = UPLOAD_IMAGE_FROM_POST_URL.replace("{postId}", postId);
	const url = urlPostId.replace("{category}", category);
	const response = await fetch(url, {
		'method': 'POST',
		'headers': {
			'Authorization': `Bearer ${TOKEN}`,
		},
		'body': imageFormData
	});

	if (!response.ok) {
		throw new Error(`Error uploading post: ${response.status}`);
	}

	return await response.json();
}

async function updateImageFromPost(imageFormData, fileIdRemove, postId, category) {
	const urlFileIdRemove = UPDATE_IMAGE_FROM_POST_URL.replace("{fileIdRemove}", fileIdRemove);
	const urlPostId = urlFileIdRemove.replace("{postId}", postId);
	const url = urlPostId.replace("{category}", category);
	const response = await fetch(url, {
		'method': 'PUT',
		'headers': {
			'Authorization': `Bearer ${TOKEN}`,
		},
		'body': imageFormData
	});

	if (!response.ok) {
		throw new Error(`Error uploading post: ${response.status}`);
	}

	return await response.json();
}

async function getImageFromPost(fileId) {
	const url = GET_IMAGE_FROM_POST_URL.replace("{fileId}", fileId);
	const response = await fetch(url, {
		'method': 'GET',
	});

	if (!response.ok) {
		throw new Error(`Error getting image from post: ${response.status}`);
	}

	const blob = await response.blob();
	const imageUrl = URL.createObjectURL(blob);
	return imageUrl;
}

async function update(post, contentType) {
	const response = await fetch(UPDATE_POST_URL, {
		'method': 'PUT',
		'headers': {
			'Content-Type': contentType,
			'Authorization': `Bearer ${TOKEN}`
		},
		'body': JSON.stringify(post)
	});

	if (!response.ok) {
		throw new Error(`Error updating post: ${response.statusText}`);
	}

	return await response.json();	
}

async function deletePost(postId, contentType) {
	const url = DELETE_POST_URL.replace("{postId}", postId);
	const response = await fetch(url, {
		'method': 'DELETE',
		'headers': {
			'Accept': contentType,
			'Authorization': `Bearer ${TOKEN}`
		}
	});

	if (!response.ok) {
		throw new Error(`Error deleting post: ${response.statusText}`);
	}

	return;
}

export const PostService = {
	findAllPostsPageable: findAllPageable,
	findAllPosts: findAll,
	findAllPostsPageableByStatus: findAllPageableByStatus,
	findAllPostsPageableByCategory: findAllPageableByCategory,
	findAllPostsPageableByStatusAndCategory: findAllPageableByStatusAndCategory,
	findByIdPost: findById,
	createPost: create,
	updatePost: update,
	deletePost: deletePost,
	uploadImageFromPost: uploadImageFromPost,
	updateImageFromPost: updateImageFromPost,
	getImageFromPost: getImageFromPost
};