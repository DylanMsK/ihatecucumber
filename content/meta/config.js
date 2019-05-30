const colors = require("../../src/styles/colors");

module.exports = {
  siteTitle: "ihatecucumber", // <title>
  shortSiteTitle: "ihatecucumber", // <title> ending for posts and pages
  siteDescription: "Dylan's python blog",
  siteUrl: "http://ihatecucumber.netlify.com",
  pathPrefix: "",
  // siteImage: "preview.jpg",
  siteImage: "../../src/images/app-icons/cucumbers.png",
  siteLanguage: "en",
  // author
  authorName: "Minsu Kang",
  authorTwitterAccount: "",
  // info
  infoTitle: "Minsu Kang",
  infoTitleNote: "python blog",
  // manifest.json
  // manifestName: "PersonalBlog - a blog starter for GatsbyJS",
  // manifestShortName: "PersonalBlog", // max 12 characters
  manifestName: "ihatecucumber",
  manifestShortName: "ihatecucumber", // max 12 characters
  manifestStartUrl: "/",
  manifestBackgroundColor: colors.background,
  manifestThemeColor: colors.background,
  manifestDisplay: "standalone",
  // contact
  contactEmail: "kms920612@gmail.com",
  // social
  authorSocialLinks: [
    { name: "github", url: "https://github.com/DylanMsK" },
    { name: "twitter", url: "https://twitter.com/" },
    { name: "facebook", url: "https://facebook.com/" }
  ]
};
