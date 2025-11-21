const path = require("path");
Editor.Panel.extend({
    _root_path: "",
    style: `
    :host { margin: 5px; }
    #input {width:70%}
    #open_dir {width:25%}
  `,

    template: `
    <ui-input id="input" disabled ></ui-input>
    <ui-button id="open_dir">打开目录</ui-button>
    <hr />
    <ui-button id="ana_btn">搜索</ui-button>
    <hr />
    <ui-button id="del_btn">删除</ui-button>
    <hr />
  `,

    $: {
        ana_btn: '#ana_btn',
        input: '#input',
        open_dir: '#open_dir',
        del_btn: '#del_btn',
    },

    ready() {
        this._root_path = path.normalize(`${Editor.Project.path}/assets`);
        this.$input.value = path.normalize(`${this._root_path}/project/i18n/i18n_en/`);
        this.$ana_btn.addEventListener("confirm", this.confirmAnalyseFunc.bind(this));
        this.$open_dir.addEventListener("confirm", this.confirmOpenDir.bind(this));
        this.$del_btn.addEventListener("confirm", this.confirmDel.bind(this));
    },

    async confirmAnalyseFunc() {
        const path = (`${this.$input.value.replace(this._root_path, "db://assets")}/**/*`).split("\\").join("/");
        Editor.log(`confirm AnalyseFunc path:${path}`)
        Editor.Ipc.sendToMain("i18n-texture-dep:analyse", path);
    },

    confirmOpenDir() {
        let dir = Editor.Dialog.openFile({
            defaultPath: this._root_path,
            properties: ["openDirectory"]
        })
        Editor.log(`confirm OpenDir dir:${dir}`)
        if (!dir || dir == -1) return;
        dir = path.normalize(String(dir));

        if (dir.indexOf(this._root_path) != 0) return Editor.log(`not project ${this._root_path} path index:${dir.indexOf(this._root_path)}`);
        this.$input.value = dir;
    },

    confirmDel() {
        Editor.Ipc.sendToMain("i18n-texture-dep:del");
    }

});

