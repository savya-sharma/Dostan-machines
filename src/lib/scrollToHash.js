// Click handler for in-page section links (e.g. "/#product-categories").
// Native hash-anchor jumps aren't tracked by Lenis, so when the browser
// jumps to an anchor on its own, Lenis just adopts wherever that landed as
// its new resting position — with nothing telling it to animate the rest
// of the way. Routing the scroll through lenis.scrollTo() instead keeps
// Lenis in control the whole time, so it always ends up smooth.
export function handleAnchorClick(event, href) {
  if (!href) return;

  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;

  const path = href.slice(0, hashIndex) || "/";
  const hash = href.slice(hashIndex + 1);
  const isSamePage = path === window.location.pathname;

  if (!isSamePage) return;

  const target = document.getElementById(hash);
  if (!target) return;

  event.preventDefault();
  history.pushState(null, "", href);

  if (window.lenis) {
    window.lenis.scrollTo(target, { offset: 0 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}
