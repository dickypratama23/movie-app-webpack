import './script/component/app-bar';
import './style/style.css';
import $ from 'jquery';
import moment from 'moment';
import './script/main';

const displayTime = () => {
  moment.locale('id');
  $('.time').text(moment().format('LTS'));
  $('.date').text(moment().format('LL'));
};

const updateTime = () => {
  displayTime();
  setTimeout(updateTime, 1000);
};

updateTime();
