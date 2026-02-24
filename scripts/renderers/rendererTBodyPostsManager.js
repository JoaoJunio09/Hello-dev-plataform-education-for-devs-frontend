import { PostStatus } from "../models/enums/postStatus.js";
import { PostCategory } from "../models/enums/postCategory.js";

export function rendererTBodyPostsManager(posts, tbody, update) {
	if (update) tbody.innerHTML = "";
	posts.forEach(post => {
		const template = document.getElementById("template-posts-manager");
		const contentTbody = template.content.cloneNode(true);

		const row = contentTbody.querySelector("tr");

		row.dataset.id = post.id;
		
		const thumbnail = contentTbody.querySelector("#thumbnail");
		const title = contentTbody.querySelector("#title");
		const status = contentTbody.querySelector("#status");
		const category = contentTbody.querySelector("#category");
		const date = contentTbody.querySelector("#date");
		const days = contentTbody.querySelector("#days");
		const commentesInfo = contentTbody.querySelector("#comments-info");
		const likesInfo = contentTbody.querySelector("#likes-info");
		thumbnail.src = post.thumbnailUrl;
		title.textContent = post.title;
		status.textContent = post.status === "" ? "Não informado" : (post.status === PostStatus.PUBLISHED ? "PUBLICADO" : "RASCUNHO");
		category.textContent = post.category === "" 
			? "Não informado" : (post.category === PostCategory.BACKEND 
			? "Backend" : (post.category === PostCategory.FRONTEND 
			? "Frontend" : "Carreira"));
		const { dateFormated, daysDiference } = formatDate(post.date);
		date.textContent = dateFormated;
		days.textContent = daysDiference;
		commentesInfo.textContent = 0;
		likesInfo.textContent = 0;

		tbody.appendChild(contentTbody);
	});

	if (window.lucide) {
    lucide.createIcons();
	}
}

function formatDate(date) {
	const [year, month, day] = date.split("-");
	const dateFormated = `${day} ${returnedMonthStringOfMonth(month)}, ${year}`;
	const daysDiference = new Date().getDate() - day === 0 ? "Hoje" : `Há ${new Date().getDate() - day} dias`;
	return { dateFormated: dateFormated, daysDiference: daysDiference };
}

function returnedMonthStringOfMonth(month) {
	switch (month) {
		case '01':
			return 'jan';
		case '02':
			return 'fev';
		case '03':
			return 'mar';
		case '04':
			return 'abr';
		case '05':
			return 'mai';
		case '06':
			return 'jun';
		case '07':
			return 'jul';
		case '08':
			return 'ago';
		case '09':
			return 'set';
		case '10':
			return 'out';
		case '11':
			return 'nov';
		case '12':
			return 'dez';
		default:
			return 'Não Informado';
	}
}