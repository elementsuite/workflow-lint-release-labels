const core = require('@actions/core');
const github = require('@actions/github');

var getBranch = async function(client, pullRequest, branch) {
  return await client.repos.getBranch({
    owner: pullRequest.owner,
    repo: pullRequest.repo,
    branch: branch
  });
}

var main = async function() {
  try {
    const token = core.getInput('github-token');
    const labelRegex = core.getInput('label-regex');
    const client = new github.GitHub(token);
    const payload = github.context.payload;
    const pullRequest = github.context.issue;
    const labels = payload.pull_request.labels;


    if (!labels.length) {
      return;
    }

    let labelBranches = [];
    for (var i = 0; i < labels.length; i++) {
      let label = labels[i];
      if (new RegExp(labelRegex, 'i').test(label.name)) {
        labelBranches.push(label.name);
      }
    }

    console.log("sam debug", labelBranches);

    let repoBranch = await getBranch(client, pullRequest, 'branch that probably doesnt exist');

    console.log("sam debug", repoBranch);


  } catch (error) {
    console.error(error.message);
  }
}

main();
