import fs from "fs";
import path from "path";
import Showdown from "showdown";

export function createWorkflowRepository(workflowDir: string) {
  const dir = workflowDir;
  const componentDir = path.join(workflowDir, "components");

  function getReadme(opt: { readmeName: string; script: string }) {
    const readmeContents = fs.readFileSync(
      path.join(dir, opt.readmeName),
      "utf8",
    );

    const markdown = new Showdown.Converter({ metadata: true });
    const contents = markdown.makeHtml(
      readmeContents,
    );

    const metadata = {
      title: path.parse(opt.script).name,
      author: "<no author>",
    };

    const frontmatter = markdown.getMetadata() as Record<string, string>;

    if (frontmatter.title) {
      metadata.title = frontmatter.title;
    }

    if (frontmatter.author) {
      metadata.author = frontmatter.author;
    }

    return {
      title: metadata.title,
      author: metadata.author,
      contents,
    };
  }

  return {
    async listFiles() {
      const [files, components] = await Promise.all([
        fs.promises.readdir(dir).catch(() => []),
        fs.promises.readdir(componentDir).catch(() => []),
      ]);

      const scripts = files.filter((f) => f.endsWith(".js"));
      const readmes = files.filter((f) => f.endsWith(".md"));

      return {
        files,
        scripts,
        readmes,
        components,
      };
    },
    async listWorkflows() {
      const { readmes, scripts } = await this
        .listFiles();

      const workflows: {
        filename: string;
        name: string;
        readme: {
          title: string;
          author: string;
          contents: string;
        };
      }[] = [];

      for (const script of scripts) {
        const foundReadme = readmes.find((readme) =>
          path.parse(readme).name === path.parse(script).name
        );

        let readme = {
          title: script,
          author: "<no author>",
          contents: "No Description Available",
        };

        if (foundReadme) {
          readme = getReadme({ readmeName: foundReadme, script });
        }

        workflows.push({
          filename: script,
          name: script,
          readme,
        });
      }

      return workflows;
    },
  };
}