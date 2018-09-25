class PassageSharesController < ApplicationController
  include BasicModule

  before_action :set_passage_share, only: [:show, :edit, :update, :destroy]
  before_action :get_user
  before_action :get_user_exception, only: [:new, :edit, :create]
  #before_action :validate_authorization, only: [:edit, :show]
  before_action :authenticate_user!

  

  # GET /passage_shares
  # GET /passage_shares.json
  def index
    ######################################################################################
    #INBOX
    @passage_shares_recieved = PassageShare.where('recieving_user_id = ?', current_user.id)
    @passage_shares_recieved_read = []
    @passage_shares_recieved_unread = []
    @passages_recieved = {}
    @sending_to_me = {}
    @passage_shares_recieved.each do |passage|
      @passages_recieved[passage.passage_id] = Passage.find(passage.passage_id)
      @sending_to_me[passage.author_user_id] = User.find(passage.author_user_id)
      if passage.opened
        @passage_shares_recieved_read.push(passage)
      else
        @passage_shares_recieved_unread.push(passage)
      end
    end

    ######################################################################################

    
    ######################################################################################
    #OUTBOX
    @passage_shares_sent = PassageShare.where('author_user_id = ?', current_user.id)
    @passage_shares_sent_opened = []
    @passage_shares_sent_unopened = []
    @passages_sent = {}
    @receiving_from_me = {}
    @passage_shares_sent.each do |passage|
      @passages_sent[passage.passage_id] = Passage.find(passage.passage_id)
      @receiving_from_me[passage.recieving_user_id] = User.find(passage.recieving_user_id)
      if passage.opened
        @passage_shares_sent_opened.push(passage)
      else
        @passage_shares_sent_unopened.push(passage)
      end
    end
    ######################################################################################

        
  end

  # GET /passage_shares/1
  # GET /passage_shares/1.json
  def show    
    puts @passage_share.inspect
    if (@passage_share.opened == false) && (@passage_share.recieving_user_id == @current_user.id)
      @passage_share.update!(opened: true, opened_at: DateTime.now)
    end

    ######################################################################################
    if @current_user.id != @passage_share.author_user_id
      @from_user = User.find(@passage_share.author_user_id)
    else
      @from_user = @current_user
    end

    if @current_user.id != @passage_share.recieving_user_id
      @to_user = User.find(@passage_share.recieving_user_id)
    else
      @to_user = @current_user
    end
    @shared_passage = Passage.find(@passage_share.passage_id)
    ######################################################################################



    ######################################################################################
    #DO NOT LET READ IF NOT INVOLVED IN MESSAGE
    if (@from_user.id == @current_user.id) || (@current_user.id == @to_user.id)
    else
      redirect_back fallback_location: '/'
    end
    ######################################################################################
  end

  # GET /passage_shares/new
  def new
    @passage_share = PassageShare.new
    @passages_belonging_to_current = Passage.where(user_id: current_user.id)

    puts @passages_belonging_to_current.inspect
    puts @passages_belonging_to_current.inspect
    puts @passages_belonging_to_current.inspect
    puts @passages_belonging_to_current.inspect

  end

  # GET /passage_shares/1/edit
  def edit
    
    @passages_belonging_to_current = Passage.where(user_id: current_user.id)
    @users_except_current = User.where('id != ?', current_user.id)
    puts '---------'
    puts '---------'
    puts '---------'
    puts params.inspect
    puts '---------'
    puts '---------'
    puts '---------'

    ######################################################################################
    #DO NOT LET EDIT IF NOT INVOLVED IN MESSAGE
    if @passage_share.author_user_id == @current_user.id
    else
      redirect_back fallback_location: '/'
    end
    ######################################################################################
  end

  # POST /passage_shares
  # POST /passage_shares.json
  def create

    @passage_share = PassageShare.new(passage_share_params)
    @passages_belonging_to_current = Passage.where(user_id: current_user.id)

    respond_to do |format|
      if @passage_share.save
        format.html { redirect_to @passage_share, notice: 'Passageshare was successfully created.' }
        format.json { render :show, status: :created, location: @passage_share }
      else
        format.html { render :new }
        format.json { render json: @passage_share.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /passageshares/1
  # PATCH/PUT /passageshares/1.json
  def update
    respond_to do |format|
      if @passage_share.update(passage_share_params)
        format.html { redirect_to @passage_share, notice: 'Passage Share was successfully updated.' }
        format.json { render :show, status: :ok, location: @passage_share }
      else
        format.html { render :edit }
        format.json { render json: @passage_share.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /passageshares/1
  # DELETE /passageshares/1.json
  def destroy
    @passageshare.destroy
    respond_to do |format|
      format.html { redirect_to passage_shares_url, notice: 'Passageshare was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_passage_share
      @passage_share = PassageShare.find(params[:id])
    end

    def get_user
      @current_user = current_user
    end

    def get_user_exception
      @users_except_current = User.where('id != ?', current_user.id)
    end
    
    def validate_authorization
      is_author = Passageshare.where(["id = ? and author_user_id = ?", params[:id], current_user.id])
      is_reciever = Passageshare.where(["id = ? and receiver_user_id = ?", params[:id], current_user.id])
      if (is_author || is_reciever)
      else
        redirect_to passage_shares_url
      end
    end



    # Never trust parameters from the scary internet, only allow the white list through.
    def passage_share_params
      params.require(:passage_share).permit(:author_user_id, :recieving_user_id, :passage_id, :edit_privilege, :message, :opened)
    end
end
