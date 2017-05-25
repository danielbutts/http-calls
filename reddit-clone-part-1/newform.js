(function() {
    'use strict';

    angular.module('app')
    .component('content', {

      controller:  function() {
        const vm = this

        vm.$onInit = function() {
          vm.newFormVisible = false;
          vm.sort = '-score'
          vm.articles = [
            {id: 1, title:'Wear More Flannel', body: `It's always a good idea to wear flannel!`, url: `https://images.pexels.com/photos/192439/pexels-photo-192439.jpeg?h=350&auto=compress&cs=tinysrgb`, author: 'Hipster Machine', score: 8, date: 'Wed May 23 2017 15:38:20 GMT-0700 (PDT)'},
            {id: 2, title:'Man buns forever', body: `If you cut your hair your skinny jeans won't fit!`, url: `https://images.pexels.com/photos/69212/pexels-photo-69212.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb`, author: 'Hipster Machine', score: 5, date: 'Wed May 21 2017 15:38:20 GMT-0700 (PDT)'},
            {id: 3, title:'I cry myself to sleep', body: `There is no self respect in the tiny hat aisle...`, url: `https://images.pexels.com/photos/211050/pexels-photo-211050.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb`, author: 'Hipster Machine', score: 3, date: 'Wed May 24 2017 20:30:20 GMT-0700 (PDT)'}
          ]
        }

        vm.toggleNewPostForm = function() {
          delete vm.newArticle
          vm.newFormVisible = !vm.newFormVisible
        }

        vm.addComment = function(id) {
          console.log(new Date());
          vm.articles.forEach((article) => {
            if (article.id === id) {
              if (article.comments === undefined) {
                article.comments = []
              }
              article.comment.date = new Date();

              article.comments.push(article.comment);
              delete article.comment
            }
          })
        }

        vm.upVote = function(id) {
          vm.articles.forEach((article) => {
            if (article.id === id) {
              article.score ++
            }
          })
        }

        vm.downVote = function(id) {
          vm.articles.forEach((article) => {
            if (article.id === id && article.score > 0) {
              article.score --
            }
          })
        }

        vm.createArticle = function() {
          vm.newFormVisible = false;
          vm.newArticle.score = 0;
          vm.newArticle.comments = [];
          vm.newArticle.date = new Date();
          vm.articles.push(vm.newArticle);
          delete vm.newArticle
        }

      },
      template: `
<div class="pull-right">
  <p><a class="btn btn-info" ng-click="$ctrl.toggleNewPostForm()"><span ng-if="!$ctrl.newFormVisible">New Post</span><span ng-if="$ctrl.newFormVisible">Cancel</span></a></p>
</div>

<ul class="nav nav-pills">
  <li role="presentation" class="active">
    <input type="search" class="form-control input-sm search-form" placeholder="Filter" ng-model="$ctrl.filter">
  </li>
  <div class="form-inline">
    <label for="sort">&nbsp;Sort by&nbsp;</label>
    <select class="form-control" ng-model="$ctrl.sort">
      <option value="-score" selected="true">Most Popular</option>
      <option value="-date">Most Recent</option>
      <option value="title">Title (A-Z)</option>
    </select>
  </div>
</ul>

<div class="row" ng-if="$ctrl.newFormVisible">
  <div class="col-md-8">

    <form ng-submit="$ctrl.createArticle()">
      <div>
        <label for="title">Title</label>
        <input id="title" class="form-control" ng-model="$ctrl.newArticle.title">
      </div>
      <div>
        <label for="body">Body</label>
        <textarea id="body" class="form-control" ng-model="$ctrl.newArticle.body"></textarea>
      </div>
      <div>
        <label for="author">Author</label>
        <input id="author" class="form-control" ng-model="$ctrl.newArticle.author">
      </div>
      <div>
        <label for="image-url">Image URL</label>
        <input id="image-url" class="form-control" ng-model="$ctrl.newArticle.url">
      </div><br>
      <div class="form-group">
        <button type="submit" class="btn btn-primary">
          Create Post
        </button>
      </div>
    </form>

  </div>
</div>
<div class="row">
  <div class="col-md-12">
    <ng-pluralize count="$ctrl.articles.length"
      when="{'0': 'No Articles:',
        'one': '1 Article:',
        'other': '{} Articles:'}">
    </ng-pluralize>
    <div ng-repeat="article in $ctrl.articles | filter:{title: $ctrl.filter} | orderBy:$ctrl.sort">
      <div class="well">
        <div class="media-left">
          <img class="media-object" ng-src="{{article.url}}">
        </div>
        <div class="media-body">
          <h4 class="media-heading">
            {{article.title}}
            |
            <a ng-click="$ctrl.upVote(article.id)"><i class="glyphicon glyphicon-arrow-up"></i></a>
            <a ng-click="$ctrl.downVote(article.id)"><i class="glyphicon glyphicon-arrow-down"></i></a>
            {{article.score}}
          </h4>
          <div class="text-right">
          <span>Message age: {{((article.date | amDifference : null : 'minutes' ) * -1) | amDurationFormat : 'minutes' }} </span>
          </div>
          <div class="text-right">
            {{article.author}}
          </div>
          <p>
            {{article.body}}
          </p>
          <ng-pluralize count="article.comments.length"
            when="{'0': 'No Comments:',
              'one': '1 Comment:',
              'other': '{} Comments:'}">
          </ng-pluralize>
          <div ng-repeat="comment in article.comments">
            <div>
              {{ comment.date | date:'MM-dd-yyyy @ h:mm a' }}
              |
              <i class="glyphicon glyphicon-comment"></i>
              <a>
                {{comment.body}}
              </a>
            </div>
          </div>
          <div class="row">
            <div class="col-md-offset-1">
              <hr>
              <p>Add a Comment:</p>
              <form class="form-inline" ng-submit="$ctrl.addComment(article.id)">
                <div class="form-group">
                  <input class="form-control" ng-model="article.comment.body">
                </div>
                <div class="form-group">
                  <input type="submit" class="btn btn-primary">
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>`
    })
})();
