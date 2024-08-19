import PropTypes from "prop-types";

export function Footer({ brandName, brandLink, routes }) {

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
       &copy; Team Project Group 1
      </div>
    </footer>
  );
}
Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
