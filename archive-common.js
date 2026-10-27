import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getStorage, ref, getBlob } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js';
import { firebaseConfig, OWNER_UID } from './archive-config.js';
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const isOwner = user => !!user && user.uid === OWNER_UID;
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const dateText = s => s ? String(s).replaceAll('-', '.') : '';
export function plainText(html) { const doc = new DOMParser().parseFromString(html || '', 'text/html'); return (doc.body.textContent || '').replace(/\s+/g,' ').trim(); }
export function safeHTML(html) { if (!window.DOMPurify) throw new Error('HTML保護ライブラリを読み込めませんでした'); return DOMPurify.sanitize(html || '', {ADD_TAGS:['ruby','rt'], ADD_ATTR:['data-path','class']}); }
export async function hydrateImages(container) {
  const images = [...container.querySelectorAll('img[data-path]')];
  await Promise.all(images.map(async img => {
    try { const blob = await getBlob(ref(storage, img.dataset.path)); img.src = URL.createObjectURL(blob); }
    catch (e) { img.alt = '画像を表示できません'; img.removeAttribute('src'); console.error(e); }
  }));
}
export async function thumb(path, element) {
  if (!path) return;
  try { const blob = await getBlob(ref(storage, path)); element.src = URL.createObjectURL(blob); }
  catch (e) { element.hidden = true; console.error(e); }
}
