import { PostService } from "../../services/postService.js";
import { MediaTypes } from "../../mediaTypes/mediaTypes.js";
import { renderPostsAndUpdatePaginationControl } from "./postManagerController.js";
import { dom } from "./postManagerController.js";

export let valueSearch = "";

dom.search.addEventListener('input', async (event) => {
	valueSearch = event.target.value
	debouncedSearch(valueSearch);
});

const handleSearch = async (value) => {
	const list = (value === "") 
		? await PostService.findAllPostsPageable(
				MediaTypes.JSON, 
				{ page: 0, size: 4, direction: 'asc' }
			)
		: await PostService.searchByTitle(
				MediaTypes.JSON,
				{ page: 0, size: 4, direction: 'asc' },
				value 
			);
	
	await renderPostsAndUpdatePaginationControl(list, true);
}

function debounce(fn, delay) {
	let timeout;

	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}

const debouncedSearch = debounce(handleSearch, 400);