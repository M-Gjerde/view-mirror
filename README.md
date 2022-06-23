<ol dir="auto">
<li>Update the version in your project's <code>package.json</code> file (e.g. <code>1.2.3</code>)</li>
<li>Commit that change (<code>git commit -am v1.2.3</code>)</li>
<li>Tag your commit (<code>git tag v1.2.3</code>). Make sure your tag name's format is <code>v*.*.*</code>. Your workflow will use this tag to detect when to create a release</li>
<li>Push your changes to GitHub (<code>git push &amp;&amp; git push --tags</code>)</li>
</ol>