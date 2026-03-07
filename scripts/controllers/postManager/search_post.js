import { PostService } from "../../services/postService.js";
import { MediaTypes } from "../../mediaTypes/mediaTypes.js";
import { renderPostsAndUpdatePaginationControl } from "./postManagerController.js";
import { dom } from "./postManagerController.js";
import { showToast } from "../../utils/toast.js";

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

	if (list._embedded === undefined) {
		showToast({message: `Não existe resultados para ${value}`, type: 'info'});
		setTimeout(async () => {
			await renderPostsAndUpdatePaginationControl(
				await PostService.findAllPostsPageable(
					MediaTypes.JSON, 
					{ page: 0, size: 4, direction: 'asc' }
				), true
			);

			dom.search.value = "";
		}, 2500);
	}
	
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