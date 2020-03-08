const core = require('@actions/core');
const github = require('@actions/github');

var getBranches = async function(client, pullRequest) {
  return await client.repos.listBranches({
    owner: pullRequest.owner,
    repo: pullRequest.repo
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

    let repoBranches = getBranches(client, pullRequest);

    console.log("sam debug", repoBranches);


  } catch (error) {
    console.error(error.message);
  }
}

main();
