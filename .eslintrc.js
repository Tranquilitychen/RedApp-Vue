module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-unused-vars": 1,
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    //关闭禁止混用tab和空格
    "no-mixed-spaces-and-tabs": [0]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
