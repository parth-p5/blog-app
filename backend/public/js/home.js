function prevBtn(page) {
  page = page-1 <= 0 ? 0 : page-1;
  const url = window.location.origin + window.location.pathname;
  window.open(url + `?pageSize=3&page=${page}`, "_self");
}

function nextBtn(page) {
  page = page+1;
  const url = window.location.origin + window.location.pathname;
  window.open(url + `?pageSize=3&page=${page}`, "_self");
}
