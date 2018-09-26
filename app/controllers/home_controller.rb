class HomeController < ApplicationController
  include BasicModule

  before_action :authenticate_user!

  def index
    @current_user = current_user
    @inbox = PassageShare.where(["recieving_user_id = ? and opened = ?", @current_user.id, false])

    puts @inbox.length
  end

  def show
    @current_user = current_user  
    @inbox = PassageShare.where(["recieving_user_id = ? and opened = ?", @current_user.id, false])
    @passages = Passage.where(user_id: @current_user.id)
    @passages_shares_recieved = PassageShare.where(recieving_user_id: @current_user.id)
    @passages_shares_sent = PassageShare.where(author_user_id: @current_user.id)
    @annotations = Annotation.where(made_by: @current_user.id)
    @updates = UpdateTrack.where(last_user_id: @current_user.id)
  end
  
end
