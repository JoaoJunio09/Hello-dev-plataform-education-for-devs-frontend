export function showToast({ 
	message, 
	type = 'info', 
	duration = 5000, 
	icon = null 
}) {
	const container = document.getElementById('toast-container');

	// Configurações de cores e ícones baseadas no tipo
	const types = {
		success: {
				bg: 'bg-white',
				border: 'border-emerald-500',
				text: 'text-slate-800',
				iconColor: 'text-emerald-500',
				progress: 'bg-emerald-500',
				defaultIcon: 'check-circle'
		},
		error: {
				bg: 'bg-white',
				border: 'border-rose-500',
				text: 'text-slate-800',
				iconColor: 'text-rose-500',
				progress: 'bg-rose-500',
				defaultIcon: 'alert-circle'
		},
		info: {
				bg: 'bg-white',
				border: 'border-blue-500',
				text: 'text-slate-800',
				iconColor: 'text-blue-500',
				progress: 'bg-blue-500',
				defaultIcon: 'info'
		}
	};

	const config = types[type] || types.info;
	const toastId = 'toast-' + Math.random().toString(36).substr(2, 9);
	const selectedIcon = icon || config.defaultIcon;

	// Criação do elemento
	const toast = document.createElement('div');
	toast.id = toastId;
	toast.className = `toast-enter pointer-events-auto relative overflow-hidden min-w-[280px] flex items-center p-4 rounded-xl border-l-4 shadow-xl ${config.bg} ${config.border} ${config.text}`;
	
	toast.innerHTML = `
			<div class="flex items-center gap-3 pr-6">
					<i data-lucide="${selectedIcon}" class="w-5 h-5 ${config.iconColor}"></i>
					<p class="text-sm font-medium">${message}</p>
			</div>
			<button class="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors" data-close>
					<i data-lucide="x" class="w-4 h-4"></i>
			</button>
			<div class="toast-progress-bar ${config.progress}" style="animation-duration: ${duration}ms;"></div>
	`;

	container.appendChild(toast);

	const closeButton = toast.querySelector('[data-close]');
	closeButton.addEventListener('click', () => closeToast(toastId));
	
	// Inicializa ícones Lucide no novo elemento
	if (window.lucide) {
			lucide.createIcons({
					attrs: { class: 'lucide' },
					nameAttr: 'data-lucide',
					root: toast
			});
	}

	// Auto-fechamento
	const timeout = setTimeout(() => {
		closeToast(toastId);
	}, duration);

	// Armazena o timeout no elemento para cancelar se fechado manualmente
	toast.dataset.timeoutId = timeout;
}

/**
 * Fecha o toast com animação
 */
function closeToast(id) {
	const toast = document.getElementById(id);
	if (!toast) return;

	clearTimeout(toast.dataset.timeoutId);
	toast.classList.replace('toast-enter', 'toast-exit');
	
	toast.addEventListener('animationend', (e) => {
			if (e.animationName === 'toast-out') {
					toast.remove();
			}
	});
}