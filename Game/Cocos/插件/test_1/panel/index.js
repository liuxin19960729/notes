
Editor.Panel.extend({
    unique: 1,
    style: `
    :host { margin: 5px; }
  `,

    template: `
    <ui-input id="input"></ui-input>
    <ui-button id="btn">搜索</ui-button>
    <hr />
  `,

    $: {
        btn: '#btn',
        input: '#input',
    },

    ready() {
        this.$input.value = 'db://assets/project/i18n/i18n_en/';
        this.$btn.addEventListener("confirm", this.confirmFunc.bind(this));
    },

    async confirmFunc() {
        let path = `${this.$input.value}**\/*`;
        Editor.Ipc.sendToMain("i18n-texture-dep:analyse", path, function (err, answer) {
            if (!!err) return Editor.error(err);
            Editor.log(`answer:${answer}`);
        }, 60 * 1000);
    },
});

