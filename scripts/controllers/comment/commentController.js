import { Exceptions } from "../../exceptions/exceptions.js";
import { showToast } from '../../utils/toast.js';

export async function makeComment(postId, usernameText, commentText) {
  try {
    if (usernameText === "" || commentText === "") {
      throw new Exceptions.TheDataIsEmptyOsNull("Preencha todas as informações");
    }

    let comment = {
      content: commentText
      user: {
        username: usernameText
      },
      postId: postId
    };

    console.log(comment);
  }
  catch (e) {
    if (e instanceof Exceptions.TheDataIsEmptyOsNull) {
      showToast({message: 'Preencha todas as informações', type: 'info'});
    } else {
      showToast({message: 'Não foi possível efetuar comentário', type: 'error'});
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Delegar clique para Likes em comentários (melhor performance)
    document.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.btn-action-like');
        if (likeBtn) {
            likeBtn.classList.toggle('active');
            const countSpan = likeBtn.querySelector('.c-like-count');
            let currentCount = parseInt(countSpan.innerText);
            countSpan.innerText = likeBtn.classList.contains('active') ? currentCount + 1 : currentCount - 1;
        }
    });

    // 2. Sistema de Respostas Inline
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-action-reply')) {
            const container = e.target.closest('.comment-content').querySelector('.reply-thread-container');
            
            if (container.querySelector('.reply-form-inline')) return;

            const form = document.createElement('div');
            form.className = 'reply-form-inline';
            form.innerHTML = `
                <input type="text" placeholder="Seu nome" class="r-name" style="width:100%; margin-bottom:8px; padding:8px; border-radius:6px; border:1px solid #ddd;">
                <textarea placeholder="Escreva sua resposta..." style="width:100%; padding:8px; border-radius:6px; border:1px solid #ddd; resize: none;"></textarea>
                <div style="margin-top:8px; display:flex; gap:10px;">
                    <button class="send-reply" style="background:var(--purple-accent); color:white; border:none; padding:6px 15px; border-radius:6px; cursor:pointer; font-weight:600;">Responder</button>
                    <button class="cancel-reply" style="background:transparent; border:none; color:var(--text-light); cursor:pointer; font-size: 0.8rem;">Cancelar</button>
                </div>
            `;
            container.appendChild(form);

            form.querySelector('.cancel-reply').onclick = () => form.remove();
            form.querySelector('.send-reply').onclick = () => {
                const name = form.querySelector('.r-name').value || 'Dev Anon';
                const text = form.querySelector('textarea').value;
                if(!text) return;

                const replyHtml = `
                    <div class="comment-card reply-card">
                        <div class="comment-avatar" style="background:var(--primary-dark); width:32px; height:32px; font-size:0.7rem;">${name.substring(0,2).toUpperCase()}</div>
                        <div class="comment-content">
                            <div class="comment-meta"><span class="user-name" style="font-size:0.85rem;">${name}</span> <span class="comment-date">agora</span></div>
                            <p style="font-size:0.85rem;">${text}</p>
                        </div>
                    </div>
                `;
                form.remove();
                container.insertAdjacentHTML('beforeend', replyHtml);
            };
        }
    });
});